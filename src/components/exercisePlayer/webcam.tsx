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

type Props = {
	width: number;
	height: number;
	opacity: number;
}

function Webcam({ width, height }: Props) {
	let timer: any = null;
	const elementRef = useRef<HTMLVideoElement>(null);
	const webcamRef = useRef<any>(null);
	let net: any;

	const inputHeight = 256;
	const inputWidth = 512;

	const upScaleRatio = width / inputWidth;

	const [keypoints, setKeypoints] = useState<any>(null);

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

		timer = setInterval(capture, 100);
	}

	async function capture() {
		if (webcamRef.current == null) return;
		const webcam = webcamRef.current;

		// 1. caputer iamge
		const image = await webcam.capture();

		// 2. inference iamge
		const pose = await net.estimateSinglePose(image, {
			flipHorizontal: false,
		});

		if (pose.score < 0.2) return;

		// 3. upscale keypoints to webcam resolution
		pose.keypoints.map( (keypoints : any) => {
			keypoints.position.x *= upScaleRatio;
			keypoints.position.y *= upScaleRatio;
		});

		// 4. set keypoints
		setKeypoints(pose.keypoints);

		// 5. keypoitns to ipc

		image.dispose();
		await tf.nextFrame();
	}

	useEffect(() => {
		load()
			.then(async () => {
				await run();
			});

		return () => {

		};
	}, [elementRef]);

	const drawKeypoints = React.useCallback((graphics) => {
		graphics.clear();

		if (!keypoints) return;

		for (let i=0; i<keypoints.length; i++) {
			const x = keypoints[i].position.x;
			const y = keypoints[i].position.y;

			graphics.beginFill(0x3970E3);
			graphics.drawCircle(x, y, 5);
			graphics.endFill();
		}
	}, [keypoints]);

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

			<SStage {...stageProps}>
				<Graphics draw={drawKeypoints}/>
			</SStage>

		</Wrapper>

	);
}

const Wrapper = styled.div`
	opacity: 0.8;
`;
const Video = styled.video``;

const SStage = styled(Stage)`
	position: absolute;

	top: 0px;
	left: 0px;

	/* z-index: 1001; */
`;

export default Webcam;
