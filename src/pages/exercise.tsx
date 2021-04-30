/* eslint-disable new-cap */
/* eslint-disable no-constant-condition */
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';
import { Tensor, InferenceSession } from 'onnxjs';
import { RxDatabase } from 'rxdb';


type props = {
	db: RxDatabase
}

const Wrapper = styled.div``;

function Exercise({ db }: props) {
	const [isPlaying, setPlaying] = useState(false);
	const camera = useRef<HTMLVideoElement>(null);
	let webcamElement : any = null;
	const session = new InferenceSession({backendHint: 'webgl'});


	const width = 1280;
	const height = 720;

	const run = async () => {
		const webcam = await tf.data.webcam(webcamElement, {
			resizeHeight: 256,
			resizeWidth: 448,
		});

		while (true) {
			// 1. caputer iamge
			const image = await webcam.capture();

			// // 2. Float32Array to onnx Tensor
			const inputArray = image.reshape([3, 256, 448]).dataSync();

			// // 3. [batch, channel, height, wdith]
			const inputTensor = new Tensor(inputArray, 'float32', [1, 3, 256, 448]);

			const output = await session.run([inputTensor]);

			console.log(output.keys());

			image.dispose();
			await tf.nextFrame();
		}
	};


	useEffect(() => {
		console.log(session);

		async function loadModel() {
			console.log('model loading');

			const file = window.api.fs.readFileSync('./src/pages/human-pose-estimation-3d.onnx');
			const uint8Array = new Uint8Array(file);

			await session.loadModel(uint8Array);
			console.log('model loaded');
		}

		loadModel()
			.then( () => {
				if (camera) {
					webcamElement = camera.current;
					run();
				}
			});
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
