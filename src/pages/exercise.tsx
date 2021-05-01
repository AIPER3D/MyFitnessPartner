/* eslint-disable new-cap */
/* eslint-disable no-constant-condition */
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';
import { Tensor, InferenceSession } from 'onnxjs';
import { RxDatabase } from 'rxdb';
import { windowsStore } from 'node:process';
import * as cp from 'child_process';
import * as posenet from '@tensorflow-models/posenet';

type props = {
	db: RxDatabase
}

const Wrapper = styled.div``;

function Exercise({ db }: props) {
	const [isPlaying, setPlaying] = useState(false);
	const camera = useRef<HTMLVideoElement>(null);
	let webcamElement : any = null;
	// const session = new InferenceSession({backendHint: 'webgl'});
	const width = 1280;
	const height = 720;

	const run = async () => {
		const net = await posenet.load({
			architecture: 'MobileNetV1',
			outputStride: 16,
			inputResolution: {width: 256, height: 256},
			multiplier: 1,
			quantBytes: 2,
		});

		const webcam = await tf.data.webcam(webcamElement, {
			resizeHeight: 256,
			resizeWidth: 256,
		});

		while (true) {
			// 1. caputer iamge
			const image = await webcam.capture();

			// 2. infernece image
			const pose = await net.estimateSinglePose(image, {
				flipHorizontal: false,
			});

			console.log(pose);

			// // // 2. Float32Array to onnx Tensor
			// const inputArray = image.reshape([3, 256, 448]).dataSync();

			// // // 3. [batch, channel, height, wdith]
			// const inputTensor = new Tensor(inputArray, 'float32', [1, 3, 256, 448]);
			// const inputScale = new Tensor([0.5], 'float32');
			// const stride = new Tensor([8], 'float32');
			// const fx = new Tensor([358.4], 'float32');

			// console.log(session);

			// const output = await session.run({
			// 	'data': inputTensor,
			// 	'inputScale': inputScale,
			// 	'stride': stride,
			// 	'fx': fx});

			image.dispose();
			// 1차원 배열에 차원 값을 가진 데이터
			await tf.nextFrame();
		}
	};

	useEffect(() => {
		if (camera) {
			webcamElement = camera.current;
		}

		run();
	});

	return (
		<Wrapper>
			<ExercisePlayer
				muted
				autoPlay
				ref={camera}
				width={width}
				height={height}>
			</ExercisePlayer>
		</Wrapper>
	);
}

const ExercisePlayer = styled.video``;
const Button = styled.button``;

export default Exercise;
