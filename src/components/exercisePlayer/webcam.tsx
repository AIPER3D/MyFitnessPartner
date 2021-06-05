/* eslint-disable new-cap */
/* eslint-disable no-constant-condition */
import React, { useEffect, useRef, useReducer, useContext } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { Stage, Sprite, Graphics } from '@inlet/react-pixi';
import { useState } from 'react';
import { drawKeypoints, drawSkeleton, getSquareBound } from '../../utils/posenet-utils';
import { loadModel, loadTMPose } from '../../utils/load-utils';
import RepetitionCounter from '../../utils/RepetitionCounter';
import * as tmPose from '@teachablemachine/pose';
import { timer } from '../../utils/bench-util';
import { RecordDAO } from '../../db/DAO';
import { recordContext, playerContext } from './player';
import moment from 'moment';
import { Padding, PosenetInput } from '@tensorflow-models/posenet/dist/types';
import { decodeMultiplePoses, MultiPersonInferenceConfig } from '@tensorflow-models/posenet';
import {
	getInputTensorDimensions,
	padAndResizeTo, scaleAndFlipPoses, toTensorBuffers3D,
} from '@tensorflow-models/posenet/dist/util';

type Props = {
	width: number;
	height: number;
	opacity: number;
	onLoaded: (val: boolean) => void;
}

interface RepetitionObject {
	Squat?: any;
	Lunge?: any;
	Jump?: any;
	[props: string]: any;
}

function Webcam({ width, height, opacity, onLoaded }: Props) {
	const { ipcRenderer } = window.require('electron');

	const recordDAO = useContext(recordContext);
	const _playerContext = useContext(playerContext);

	const videoRef = useRef<HTMLVideoElement>(null);
	const webcamRef = useRef<any>(null);
	const requestRef = useRef<number>(0);

	// posenet 모델과 운동 횟수 카운터
	const poseNets = useRef<any>(null);

	const poseNet = useRef<posenet.PoseNet>();
	const repetitionCounter = useRef<RepetitionObject>({});

	// 웹캠의 입력 해상도
	const inputResolution = 257;

	const widthScaleRatio = width / inputResolution;
	const heightScaleRatio = height / inputResolution;

	const endRef = useRef<boolean>(false);

	// const [poses, setPoses] = useState<any>(null);
	const poses = useRef<any>(null);

	useEffect(() => {
		const startTime = moment().unix();

		const previousPoseLabel = _playerContext.poseLabel;

		return () => {
			try {
				const endTime = moment().unix();

				// 처음 시작하면 기록 안함
				if (previousPoseLabel == '') return;

				const record: {
					name: string;
					startTime: number;
					endTime: number;
					count: number;
				} = {
					name: previousPoseLabel,
					startTime,
					endTime,
					count: repetitionCounter.current[previousPoseLabel].nRepeats,
				};

				// poseLabel이 바뀌면  운동 기록 저장
				if (_playerContext.poseLabel != previousPoseLabel) {
					recordDAO.recordExercise.push(record);
				}

				if (_playerContext.totalSeq == _playerContext.currentSeq) {
					_playerContext.recordEended = true;
				}
			} catch (e) {
				//
			}
		};
	}, [_playerContext.poseLabel]);

	useEffect(() => {
		load()
			.then(async () => {
				await run();
				onLoaded(true);
			});

		return () => {
			endRef.current = true;

			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}

			if (webcamRef.current) {
				webcamRef.current.stop();
			}

			if (poseNets.current) {
				Object.keys(poseNets.current).forEach((key) => {
					poseNets.current[key].dispose();
				});
			}
		};
	}, []);

	async function load() {
		poseNet.current = await posenet.load({
			architecture: 'ResNet50',
			outputStride: 32,
			inputResolution: { width: inputResolution, height: inputResolution },
			multiplier: 1,
			quantBytes: 2,
		});

		const poseSquat = await loadTMPose('files/models/exercise_classifier/Squat/model.json');
		const poseLunge = await loadTMPose('files/models/exercise_classifier/Lunge/model.json');
		const poseJump = await loadTMPose('files/models/exercise_classifier/Jump/model.json');

		poseNets.current = {
			Squat: poseSquat,
			Lunge: poseLunge,
			Jump: poseJump,
		};

		repetitionCounter.current = {
			Squat: new RepetitionCounter(poseSquat.getMetadata().labels[0], 0.7, 0.2),
			Lunge: new RepetitionCounter(poseLunge.getMetadata().labels[0], 0.8, 0.2),
			Jump: new RepetitionCounter(poseJump.getMetadata().labels[0], 0.8, 0.2),
		};
	}

	async function run() {
		if (videoRef.current == null) return;

		webcamRef.current = await tf.data.webcam(videoRef.current, {
			// resizeHeight: width > height ? height : width,
			// resizeWidth: width > height ? height : width,
			// centerCrop: true,
		});

		requestRef.current = requestAnimationFrame(capture);
	}

	const t = timer(true);

	async function capture() {
		try {
			if (endRef.current) return;

			// 1. caputer iamges
			const image = await webcamRef.current.capture();

			const resizedTensor = tf.tidy(() : tf.Tensor3D => {
			// // 1. get tensor from video element

				// // 2. resize tensor
				const boundingBox = getSquareBound(image.shape[1], image.shape[0]);
				const expandedTensor : tf.Tensor4D = image.expandDims(0);

				const resizedTensor = tf.image.cropAndResize(
					expandedTensor,
					[boundingBox],
					[0], [inputResolution, inputResolution],
					'bilinear');

				// return resizedTensor;
				return resizedTensor.reshape(resizedTensor.shape.slice(1) as [number, number, number]);
			});

			console.log(resizedTensor.shape);

			const label = _playerContext.poseLabel;

			if (label == '') throw new Error('label is empty');

			// 2. estimate pose
			// const {pose, posenetOutput} = await poseNets.current[label].estimatePose(image, true);
			const {pose, posenetOutput} = await estimatePose(resizedTensor, true);

			if (pose == null) throw new Error('pose is null');
			ipcRenderer.send('webcam-poses', pose);

			console.log(posenetOutput);

			// 3. pose classification
			// const result = await poseNets.current[label].predict(posenetOutput);

			const inputwidth = image.shape[1];
			const inputheight = image.shape[0];
			const posSize = (inputwidth > inputheight ? inputheight : inputwidth);
			const dx = (inputwidth - posSize) / 2;

			pose.keypoints.map((keypoint: any) => {
				keypoint.position.x *= posSize / inputResolution;
				keypoint.position.y *= posSize / inputResolution;

				keypoint.position.x += dx;
			});

			// if (!poseNet.current) throw new Error('posenet not loaded');

			// t.start('estimate pose');
			// const estimatePoses = await poseNet.current.estimateMultiplePoses(image, {
			// 	flipHorizontal: true,
			// 	maxDetections: 3,
			// 	scoreThreshold: 0.5,
			// 	nmsRadius: 20,
			// });
			// t.stop();

			// estimatePoses.forEach((pose: any) => {
			// 	pose.keypoints.map((keypoint: any) => {
			// 		keypoint.position.x *= widthScaleRatio;
			// 		keypoint.position.y *= heightScaleRatio;
			// 	});
			// });

			// _playerContext.currentCount = 0;
			// _playerContext.currentCount = repetitionCounter.current[label].count(result);

			// 4. set keypoints
			poses.current = [pose];

			resizedTensor.dispose();
			image.dispose();
			await tf.nextFrame();
		} catch (e) {
			console.log(e);
		}
		requestRef.current = requestAnimationFrame(capture);
	}


	const draw = React.useCallback((graphics) => {
		graphics.clear();

		if (poses.current == null) return;

		poses.current.forEach(({ score, keypoints }: { score: number, keypoints: [] }) => {
			if (score >= 0.1) {
				drawKeypoints(graphics, keypoints, 0.2);
				drawSkeleton(graphics, keypoints, 0.2);
			}
		});
	}, [poses.current]);

	const stageProps = {
		width: width,
		height: height,
		options: {
			backgroundAlpha: 0,
			antialias: true,
			backgroundColor: 0x000000,
		},
	};

	async function estimatePose(sample: PosenetInput, flipHorizontal = false) {
		const {
			heatmapScores,
			offsets,
			displacementFwd,
			displacementBwd,
			padding,
		} = await estimatePoseOutputs(sample);

		const posenetOutput = poseOutputsToAray(
			heatmapScores,
			offsets,
			displacementFwd,
			displacementBwd
		);

		const pose = await poseOutputsToKeypoints(
			sample,
			heatmapScores,
			offsets,
			displacementFwd,
			displacementBwd,
			padding,
			flipHorizontal
		);

		return { pose, posenetOutput };
	}

	function poseOutputsToAray(
		heatmapScores: tf.Tensor3D,
		offsets: tf.Tensor3D,
		displacementFwd: tf.Tensor3D,
		displacementBwd: tf.Tensor3D
	) {
		const axis = 2;
		const concat = tf.concat([heatmapScores, offsets], axis);
		const concatArray = concat.dataSync() as Float32Array;

		concat.dispose();

		return concatArray;
	}

	async function poseOutputsToKeypoints(
		input: PosenetInput,
		heatmapScores: tf.Tensor3D,
		offsets: tf.Tensor3D,
		displacementFwd: tf.Tensor3D,
		displacementBwd: tf.Tensor3D,
		padding: Padding,
		flipHorizontal = false
	) {
		const config = {
			maxDetections: 3,
			scoreThreshold: 0.5,
			nmsRadius: 20,
		};

		const [height, width] = getInputTensorDimensions(input);

		const outputStride = poseNet.current!.baseModel.outputStride;
		const inputResolution = poseNet.current!.inputResolution;

		const [scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer] =
			await toTensorBuffers3D([heatmapScores, offsets, displacementFwd, displacementBwd]);

		const poses = await decodeMultiplePoses(scoresBuffer, offsetsBuffer, displacementsFwdBuffer,
			displacementsBwdBuffer, outputStride, config.maxDetections, config.scoreThreshold, config.nmsRadius);

		const resultPoses = scaleAndFlipPoses(poses, [height, width], inputResolution,
			padding, flipHorizontal);

		heatmapScores.dispose();
		offsets.dispose();
		displacementFwd.dispose();
		displacementBwd.dispose();

		return resultPoses[0];
	}

	async function estimatePoseOutputs(sample: PosenetInput) {
		const inputResolution = poseNet.current!.inputResolution;

		const { resized, padding } = padAndResizeTo(sample, inputResolution);

		const { heatmapScores, offsets, displacementFwd, displacementBwd } =
			await poseNet.current!.baseModel.predict(resized);

		resized.dispose();

		return { heatmapScores, offsets, displacementFwd, displacementBwd, padding };
	}

	return (
		<Wrapper>
			<Video
				muted
				autoPlay
				ref={videoRef}
				width={width}
				height={height}
			/>

			<PixiStage {...stageProps}>
				<Graphics draw={draw} />
			</PixiStage>

		</Wrapper>

	);
}

const Wrapper = styled.div`
	opacity: 0.8;
	width: 640px;
	height: 320px;
`;
const Video = styled.video`
	transform: rotateY(180deg);
`;

const PixiStage = styled(Stage)`
	position: absolute;

	top: 0px;
	left: 0px;

	/* z-index: 1001; */
`;

export default Webcam;
