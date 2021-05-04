/* eslint-disable new-cap */
/* eslint-disable no-constant-condition */
import React, { useEffect, useRef, useReducer } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { Stage, Sprite, Graphics } from '@inlet/react-pixi';
import { Container } from 'pixi.js';
import { useCallback } from 'react';
import { useState } from 'react';
import { iif } from 'rxjs';
import { drawKeypoints, drawSkeleton } from '../../util/posenet-utils';

type Props = {
	width: number;
	height: number;
	opacity: number;
}

function Webcam({ width, height }: Props) {
	const {ipcRenderer} = window.require('electron');

	const elementRef = useRef<HTMLVideoElement>(null);
	const webcamRef = useRef<any>(null);
	let net: any;

	const inputHeight = 256;
	const inputWidth = 256;

	const widthScaleRatio = width / inputWidth;
	const heightScaleRatio = height / inputHeight;

	const [poses, setPose] = useState<any>(null);

	const [isPlaying, setPlaying] = useState<boolean>(true);

	async function load() {
		net = await posenet.load({
			architecture: 'MobileNetV1',
			outputStride: 16,
			inputResolution: { width: inputWidth, height: inputHeight },
			multiplier: 1,
			quantBytes: 2,
		});
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

	async function capture() {
		if (webcamRef.current == null) return;
		const webcam = webcamRef.current;

		// 1. caputer iamge
		const image = await webcam.capture();

		// 2. inference iamge
		const inferencedPoses = await net.estimateMultiplePoses(image, {
			flipHorizontal: false,
			maxDetections: 3,
			scoreThreshold: 0.5,
			nmsRadius: 20,
		});

		// 3. upscale keypoints to webcam resolution
		inferencedPoses.forEach(({ score, keypoints }: { score: number, keypoints: [] }) => {
			keypoints.map((keypoint: any) => {
				keypoint.position.x *= widthScaleRatio;
				keypoint.position.y *= heightScaleRatio;
			});
		});

		if (inferencedPoses.length >= 1) {
			ipcRenderer.send('webcam-poses', inferencedPoses);
		}


		// 4. set keypoints
		setPose(inferencedPoses);

		image.dispose();
		await tf.nextFrame();

		requestAnimationFrame(capture);
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
const Video = styled.video``;

const PixiStage = styled(Stage)`
	position: absolute;

	top: 0px;
	left: 0px;

	/* z-index: 1001; */
`;

export default Webcam;
