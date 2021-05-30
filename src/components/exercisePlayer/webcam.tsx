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
import { recordContext } from './player';
import moment from 'moment';

type Props = {
	width: number;
	height: number;
	opacity: number;
	poseLabel : string;
	onLoaded: (val: boolean) => void;
	// setRecordExercise : React.Dispatch<React.SetStateAction<RecordDAO['recordExercise']>>
}

interface RepetitionObject {
	Squat?: any;
	Lunge?: any;
	Jump?: any;
	[props:string] : any;
}

function Webcam({ width, height, opacity, poseLabel, onLoaded }: Props) {
	const {ipcRenderer} = window.require('electron');

	const recordDAO = useContext(recordContext);

	const videoRef = useRef<HTMLVideoElement>(null);
	const webcamRef = useRef<any>(null);

	const requestRef = useRef<number>(0);

	const [poseNets, setPoseNets] = useState<any>();

	const repetitionCounter = useRef<RepetitionObject>({});

	const inputHeight = 224;
	const inputWidth = 224;

	const widthScaleRatio = width / inputWidth;
	const heightScaleRatio = height / inputHeight;

	const [poses, setPoses] = useState<any>(null);
	// const [recordExcercise, _] = useState<RecordDAO['recordExercise']>([]);

	useEffect(() => {
		load()
			.then(async () => {
				await run();
			});

		// const _timer = timer(false);

		const startTime = moment().unix();

		return () => {
			if (webcamRef.current) {
				webcamRef.current.stop();
			}

			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}

			if (poseLabel != '') {
				const endTime = moment().unix();

				const record : {
					name: string;
					startTime: Number;
					endTime: Number;
					count: Number;
				} = {
					name: poseLabel,
					startTime,
					endTime,
					count: repetitionCounter.current[poseLabel].nRepeats,
				};

				recordDAO.recordExercise.push(record);
			}
		};
	}, [poseLabel]);

	async function load() {
		const poseSquat = await loadTMPose('files/models/exercise_classifier/Squat/model.json');
		const poseLunge = await loadTMPose('files/models/exercise_classifier/Lunge/model.json');
		const poseJump = await loadTMPose('files/models/exercise_classifier/Jump/model.json');

		setPoseNets({
			Squat: poseSquat,
			Lunge: poseLunge,
			Jump: poseJump,
		});

		repetitionCounter.current = {
			Squat: new RepetitionCounter(poseSquat.getMetadata().labels[0], 0.8, 0.2),
			Lunge: new RepetitionCounter(poseLunge.getMetadata().labels[0], 0.8, 0.2),
			Jump: new RepetitionCounter(poseJump.getMetadata().labels[0], 0.8, 0.2),
		};

		onLoaded(true);
	}

	async function run() {
		if (videoRef.current == null) return;
		const element = videoRef.current;

		webcamRef.current = await tf.data.webcam(element, {
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

			if (image == null) {
				return;
			}

			if (poseLabel != '') {
				// 2. estimate pose
				const {pose, posenetOutput} = await poseNets[poseLabel].estimatePose(image, true);

				if (pose == null) {
					requestRef.current = requestAnimationFrame(capture);
					return;
				}

				// 3. pose classification
				const result = await poseNets[poseLabel].predict(posenetOutput);

				ipcRenderer.send('webcam-poses', pose);

				pose.keypoints.map( (keypoint : any) => {
					keypoint.position.x *= widthScaleRatio;
					keypoint.position.y *= heightScaleRatio;
				});

				repetitionCounter.current[poseLabel].count(result);

				// 4. set keypoints
				setPoses([pose]);
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

		if (poses == null) return;

		poses.forEach(({ score, keypoints }: { score: number, keypoints: [] }) => {
			if (score >= 0.1) {
				drawKeypoints(graphics, keypoints, 0.5);
				drawSkeleton(graphics, keypoints, 0.5);
			}
		});
	}, [poses]);

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
