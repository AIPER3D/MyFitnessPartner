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
	const {ipcRenderer} = window.require('electron');

	const elementRef = useRef<HTMLVideoElement>(null);
	const webcamRef = useRef<any>(null);

	const requestRef = useRef<number>();

	let poseNet : tmPose.CustomPoseNet;

	let repetitionCounter : RepetitionCounter;

	const inputHeight = 224;
	const inputWidth = 224;

	const widthScaleRatio = width / inputWidth;
	const heightScaleRatio = height / inputHeight;

	const [poses, setPoses] = useState<any>(null);

	const [isPlaying, setPlaying] = useState<boolean>(true);

	async function load() {
		poseNet = await loadTMPose('files/models/exercise_classifier/Squat/model.json');
		repetitionCounter = new RepetitionCounter(poseNet.getMetadata().labels[0], 0.8, 0.2);
	}

	async function run() {
		if (elementRef.current == null) return;
		const element = elementRef.current;

		webcamRef.current = await tf.data.webcam(element, {
			resizeHeight: inputHeight,
			resizeWidth: inputWidth,
			centerCrop: false,
		});

		requestRef.current = requestAnimationFrame(capture);
	}

	let count = 0;

	async function capture() {
		try {
			if (webcamRef.current == null) return;
			const webcam = webcamRef.current;

			// 1. caputer iamge
			const image = await webcam.capture();

			if (image == null) return;

			// 2. estimate pose
			const {pose, posenetOutput} = await poseNet.estimatePose(image, true);

			// 3. pose classification
			const result = await poseNet.predict(posenetOutput);

			if (pose == null) {
				requestRef.current = requestAnimationFrame(capture);
				return;
			}

			pose.keypoints.map( (keypoint : any) => {
				keypoint.position.x *= widthScaleRatio;
				keypoint.position.y *= heightScaleRatio;
			});

			if (count % 2 == 0) {
				ipcRenderer.send('webcam-poses', pose);
			}

			repetitionCounter.count(result);

			// 4. set keypoints
			setPoses([pose]);

			image.dispose();
			await tf.nextFrame();
			count++;
		} catch (e) {
			console.log(e);
		}
		requestRef.current = requestAnimationFrame(capture);
	}

	useEffect(() => {
		load()
			.then(async () => {
				await run();
			});

		return () => {
			if (webcamRef.current) {
				webcamRef.current.stop();
			}

			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, []);

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
