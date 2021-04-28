/* eslint-disable new-cap */
/* eslint-disable no-constant-condition */
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';
import { InferenceSession, Tensor } from 'onnxjs';
import { RxDatabase } from 'rxdb';

type props = {
	db: RxDatabase
}

const Wrapper = styled.div``;

function Exercise({ db }: props) {
	const [isPlaying, setPlaying] = useState(false);
	const camera = useRef(null);
	let session : InferenceSession;

	let webcamElement: any;

	const width = 1280;
	const height = 720;

	const run = async () => {
		const webcam = await tf.data.webcam(webcamElement, {
			resizeHeight: 256,
			resizeWidth: 256,
		});

		while (true) {
			// 1. caputer iamge
			const image = await webcam.capture();

			// 2. Float32Array to onnx Tensor
			const inputArray = image.reshape([3, 256, 256]).dataSync();

			// 3. [batch, channel, height, wdith]
			const inputTensor = new Tensor(inputArray, 'float32');
			const output = await session.run([inputTensor]);

			console.log(output);

			image.dispose();
			await tf.nextFrame();
		}
	};

	run();

	useEffect(() => {
		session = new InferenceSession();

		if (camera) {
			webcamElement = camera.current;
		}

		async function loadModel() {
			await session.loadModel('human-pose-estimation-3d.onnx');
			console.log('model loaded');
		}

		loadModel();
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
