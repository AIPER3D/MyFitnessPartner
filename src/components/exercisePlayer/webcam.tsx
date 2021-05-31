/* eslint-disable new-cap */
/* eslint-disable no-constant-condition */
import React, { useEffect, useRef, useReducer, useContext } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { Stage, Sprite, Graphics } from '@inlet/react-pixi';
import { useState } from 'react';
import { drawKeypoints, drawSkeleton } from '../../utils/posenet-utils';
import { loadModel, loadTMPose } from '../../utils/load-utils';
import RepetitionCounter from '../../utils/RepetitionCounter';
import * as tmPose from '@teachablemachine/pose';
import { timer } from '../../utils/bench-util';
import { RecordDAO } from '../../db/DAO';
import { recordContext, playerContext } from './player';
import moment from 'moment';

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
	[props:string] : any;
}

function Webcam({ width, height, opacity, onLoaded }: Props) {
	const {ipcRenderer} = window.require('electron');

	const recordDAO = useContext(recordContext);
	const _playerContext = useContext(playerContext);

	const videoRef = useRef<HTMLVideoElement>(null);
	const webcamRef = useRef<any>(null);
	const requestRef = useRef<number>(0);

	// posenet 모델과 운동 횟수 카운터
	const poseNets = useRef<any>(null);
	const repetitionCounter = useRef<RepetitionObject>({});

	// 웹캠의 입력 해상도
	const inputHeight = 224;
	const inputWidth = 224;

	const widthScaleRatio = width / inputWidth;
	const heightScaleRatio = height / inputHeight;

	// const [poses, setPoses] = useState<any>(null);
	const poses = useRef<any>(null);

	useEffect(() => {
		const startTime = moment().unix();

		const previousPoseLabel = _playerContext.poseLabel;

		return () => {
			const endTime = moment().unix();

			// 처음 시작하면 기록 안함
			if (previousPoseLabel == '') return;

			const record : {
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
				console.log(record);
			}

			// 마지막 poseLabel이면 운동 기록 저장
			if (_playerContext.totalSeq == _playerContext.currentSeq) {
				recordDAO.recordExercise.push(record);
				console.log(record);
			}
		};
	}, [_playerContext.poseLabel]);

	useEffect( () => {
		load()
			.then(async () => {
				await run();
			});

		console.log('webcam load model');

		return () => {
			if (webcamRef.current) {
				webcamRef.current.stop();
			}

			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
				console.log('canceled');
				return;
			}

			if (poseNets.current) {
				Object.keys(poseNets.current).forEach((key) => {
					poseNets.current[key].dispose();
				});
			}
		};
	}, []);

	async function load() {
		const poseSquat = await loadTMPose('files/models/exercise_classifier/Squat/model.json');
		const poseLunge = await loadTMPose('files/models/exercise_classifier/Lunge/model.json');
		const poseJump = await loadTMPose('files/models/exercise_classifier/Jump/model.json');

		poseNets.current = {
			Squat: poseSquat,
			Lunge: poseLunge,
			Jump: poseJump,
		};

		repetitionCounter.current = {
			Squat: new RepetitionCounter(poseSquat.getMetadata().labels[0], 0.8, 0.2),
			Lunge: new RepetitionCounter(poseLunge.getMetadata().labels[0], 0.8, 0.2),
			Jump: new RepetitionCounter(poseJump.getMetadata().labels[0], 0.8, 0.2),
		};

		onLoaded(true);
	}

	async function run() {
		if (videoRef.current == null) return;

		webcamRef.current = await tf.data.webcam(videoRef.current, {
			resizeHeight: inputHeight,
			resizeWidth: inputWidth,
			centerCrop: false,
		});

		requestRef.current = requestAnimationFrame(capture);
	}

	async function capture() {
		try {
			const webcam = webcamRef.current;

			// 1. caputer iamge
			const image = await webcam.capture();

			if (image == null) return;

			const label = _playerContext.poseLabel;

			if (label != '') {
				// 2. estimate pose
				const {pose, posenetOutput} = await poseNets.current[label].estimatePose(image, true);

				if (pose != null) {
					// 3. pose classification
					const result = await poseNets.current[label].predict(posenetOutput);

					ipcRenderer.send('webcam-poses', pose);

					pose.keypoints.map( (keypoint : any) => {
						keypoint.position.x *= widthScaleRatio;
						keypoint.position.y *= heightScaleRatio;
					});

					repetitionCounter.current[label].count(result);

					// 4. set keypoints
					// setPoses([pose]);
					poses.current = [pose];
				}
			}

			image.dispose();
			await tf.nextFrame();
		} catch (e) {
			console.log(e);
		}
		requestRef.current = requestAnimationFrame(capture);
	}


	const draw = React.useCallback( (graphics) => {
		graphics.clear();

		if (poses.current == null) return;

		poses.current.forEach(({ score, keypoints }: { score: number, keypoints: [] }) => {
			if (score >= 0.1) {
				drawKeypoints(graphics, keypoints, 0.5);
				drawSkeleton(graphics, keypoints, 0.5);
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
				<Graphics draw={draw}/>
			</PixiStage>

		</Wrapper>

	);
}

const Wrapper = styled.div`
	opacity: 0.8;
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
