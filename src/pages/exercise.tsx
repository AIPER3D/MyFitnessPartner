/* eslint-disable new-cap */
/* eslint-disable no-constant-condition */
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';
import { Tensor, InferenceSession } from 'onnxjs';
import { RxDatabase } from 'rxdb';
import {spawn} from 'child_process';
import { windowsStore } from 'node:process';

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
			image.dispose();

			// console.log(output.keys());

			const features = output.get('features');
			const partAffinityField = output.get('pafs');
			const heatmaps = output.get('heatmaps');

			if (features && partAffinityField && heatmaps) {
				const fdim = features?.dims;

				const featuresTensor =
					tf.tensor4d(features.data, [fdim[0], fdim[1], fdim[2], fdim[3]], 'float32');

				const pdim = partAffinityField?.dims;

				const partAffinityFieldTensor =
					tf.tensor4d(
						partAffinityField?.data, [pdim[0], pdim[1], pdim[2], pdim[3]], 'float32');

				const hdim = heatmaps.dims;

				const heatmapsTensor =
					tf.tensor4d(
						heatmaps?.data, [pdim[0], pdim[1], pdim[2], pdim[3]], 'float32');

				const process = window.api.spawn(
					'python',
					['src/util/modules/parse_poses.py',
						featuresTensor,
						partAffinityFieldTensor,
						heatmapsTensor]);
			}

			// 1차원 배열에 차원 값을 가진 데이터
			await tf.nextFrame();
		}
	};


	useEffect(() => {
		console.log(session);

		async function loadModel() {
			console.log('model loading');

			const file = window.api.fs.readFileSync('src/model/human-pose-estimation-3d.onnx');
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
