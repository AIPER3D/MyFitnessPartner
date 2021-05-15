/* eslint-disable new-cap */
/* eslint-disable no-constant-condition */
import React, { useEffect, useRef, useReducer } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { Stage, Sprite, Graphics } from '@inlet/react-pixi';
import { useState } from 'react';
import { drawKeypoints, drawSkeleton } from '../../utils/posenet-utils';
import { loadModel } from '../../utils/load-utils';
import { Tensor } from '@tensorflow/tfjs';
import RepetitionCounter from '../../models/RepetitionCounter';

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

	let poseNet: posenet.PoseNet;
	let poseClassification : tf.LayersModel;

	let repetitionCounter : RepetitionCounter;

	const inputHeight = 224;
	const inputWidth = 224;

	const widthScaleRatio = width / inputWidth;
	const heightScaleRatio = height / inputHeight;

	const [poses, setPose] = useState<any>(null);

	const [isPlaying, setPlaying] = useState<boolean>(true);

	async function load() {
		poseNet = await posenet.load({
			architecture: 'MobileNetV1',
			outputStride: 16,
			inputResolution: { width: inputWidth, height: inputHeight },
			multiplier: 1,
			quantBytes: 2,
		});

		poseClassification = await loadModel('src/models/exercise_classifier/Squat/model.json');

		repetitionCounter = new RepetitionCounter('SquatTrue', 0.9, 0.1);

		console.log(poseClassification);
	}

	async function run() {
		if (elementRef.current == null) return;
		const element = elementRef.current;

		webcamRef.current = await tf.data.webcam(element, {
			resizeHeight: inputHeight,
			resizeWidth: inputWidth,
		});

		await capture();
	}

	let count = 0;
	async function capture() {
		if (webcamRef.current == null) return;
		const webcam = webcamRef.current;

		// 1. caputer iamge
		const image = await webcam.capture();

		// 2. inference iamge
		const inferencedPoses = await poseNet.estimateMultiplePoses(image, {
			flipHorizontal: true,
			maxDetections: 3,
			scoreThreshold: 0.5,
			nmsRadius: 20,
		});

		// 3. upscale keypoints to webcam resolution
		inferencedPoses.forEach(( pose : posenet.Pose) => {
			pose.keypoints.map((keypoint: any) => {
				keypoint.position.x *= widthScaleRatio;
				keypoint.position.y *= heightScaleRatio;
			});
		});

		if (inferencedPoses.length >= 1&&
			count % 5 == 0) {
			ipcRenderer.send('webcam-poses', inferencedPoses);
		}

		console.log((poseClassification.predict(tf.expandDims(image, 0)) as tf.Tensor).dataSync());

		// 4. set keypoints
		setPose(inferencedPoses);

		image.dispose();
		await tf.nextFrame();

		requestAnimationFrame(capture);
		count++;
	}

	useEffect(() => {
		load()
			.then(async () => {
				await run();
			});

		return () => {

		};
	}, [elementRef]);

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
