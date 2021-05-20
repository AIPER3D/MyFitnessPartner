/* eslint-disable new-cap */
/* eslint-disable no-constant-condition */
import React, { useEffect, useRef, useReducer } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { Stage, Sprite, Graphics } from '@inlet/react-pixi';
import { useState } from 'react';
import { drawKeypoints, drawSkeleton } from '../../utils/posenet-utils';
import { loadModel, loadTMPose } from '../../utils/load-utils';
import RepetitionCounter from '../../utils/RepetitionCounter';
import * as tmPose from '@teachablemachine/pose';

type Props = {
	width: number;
	height: number;
	opacity: number;
}

function Webcam({ width, height }: Props) {
	// const tf = window.require('@tensorflow/tfjs');
	const {ipcRenderer} = window.require('electron');

	const elementRef = useRef<HTMLVideoElement>(null);
	const webcamRef = useRef<any>(null);

	const requestRef = useRef<number>();

	// let poseNet: posenet.PoseNet;
	// let poseClassification : tf.LayersModel;

	let poseNet : tmPose.CustomPoseNet;

	let repetitionCounter : RepetitionCounter;

	const inputHeight = 257;
	const inputWidth = 257;

	const widthScaleRatio = width / inputWidth;
	const heightScaleRatio = height / inputHeight;

	const [poses, setPose] = useState<any>(null);

	const [isPlaying, setPlaying] = useState<boolean>(true);

	async function load() {
		// poseNet = await posenet.load({
		// 	architecture: 'MobileNetV1',
		// 	outputStride: 16,
		// 	inputResolution: { width: inputWidth, height: inputHeight },
		// 	multiplier: 1,
		// 	quantBytes: 2,
		// });

		poseNet = await loadTMPose('files/models/exercise_classifier/Squat/model.json');

		// poseClassification = await loadModel('./files/models/exercise_classifier/Squat/model.json');

		repetitionCounter = new RepetitionCounter(poseNet.getMetadata().labels[0], 0.8, 0.2);
	}

	async function run() {
		if (elementRef.current == null) return;
		const element = elementRef.current;

		webcamRef.current = await tf.data.webcam(element, {
			resizeHeight: inputHeight,
			resizeWidth: inputWidth,
		});

		requestRef.current = requestAnimationFrame(capture);
	}

	let count = 0;
	async function capture() {
		if (webcamRef.current == null) return;
		const webcam = webcamRef.current;

		// 1. caputer iamge
		const image = await webcam.capture();
		// 2. estimate pose
		if (image == null) return;
		const {pose, posenetOutput} = await poseNet.estimatePose(image, true);

		// pose.keypoints.slice(0, 4).forEach( (keypoint) => {
		// 	if (keypoint.score < 0.3) {
		// 		requestAnimationFrame(capture);
		// 		return;
		// 	}
		// });

		// 3. pose classification
		const result = await poseNet.predict(posenetOutput);

		// 4. pose counting
		console.log(repetitionCounter.count(result));

		if (!pose) {
			requestRef.current = requestAnimationFrame(capture);
			return;
		}

		pose.keypoints.map( (keypoint : any) => {
			keypoint.position.x *= widthScaleRatio;
			keypoint.position.y *= heightScaleRatio;
		});


		// if (inferencedPoses.length >= 1&&
		// 	count % 5 == 0) {
		// 	ipcRenderer.send('webcam-poses', inferencedPoses);
		// }

		if (count % 5 == 0) {
			ipcRenderer.send('webcam-poses', pose);
		}

		// 4. set keypoints
		setPose([pose]);

		image.dispose();
		await tf.nextFrame();
		count++;

		requestRef.current = requestAnimationFrame(capture);
	}

	useEffect(() => {
		load()
			.then(async () => {
				await run();
			});

		return () => {
			webcamRef.current.stop();
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, []);

	const draw = React.useCallback( (graphics) => {
		graphics.clear();

		if (poses == null) return;

		poses.forEach(({ score, keypoints }: { score: number, keypoints: [] }) => {
			if (score >= 0.3) {
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
				ref={elementRef}
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
