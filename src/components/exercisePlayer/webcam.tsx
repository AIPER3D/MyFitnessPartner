/* eslint-disable new-cap */
/* eslint-disable no-constant-condition */
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import * as tf from '@tensorflow/tfjs';
import { InferenceSession, Tensor } from 'onnxjs';

type Props = {
	width: number;
	height: number;
}

const Wrapper = styled.video``;

function Webcam({ width, height } : Props) {
	let timer: any = null;
	const session = new InferenceSession({ backendHint: 'webgl' });
	const elementRef = useRef<HTMLVideoElement>(null);
	const webcamRef = useRef<any>(null);

	async function load() {
		const file = window.api.fs.readFileSync('src/model/human-pose-estimation-3d.onnx');
		const uint8Array = new Uint8Array(file);

		await session.loadModel(uint8Array);
		console.log('model loaded');
	}
	async function run() {
		if (elementRef.current == null) return;
		const element = elementRef.current;

		webcamRef.current = await tf.data.webcam(element, {
			resizeHeight: 256,
			resizeWidth: 448,
		});

		timer = setInterval(capture, 10000);
	}
	async function capture() {
		if (webcamRef.current == null) return;
		const webcam = webcamRef.current;

		// 1. caputer iamge
		const image = await webcam.capture();

		// 2. Float32Array to onnx Tensor
		const inputArray = image.reshape([3, 256, 448]).dataSync();

		// 3. [batch, channel, height, wdith]
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
				tf.tensor4d(
					features.data, [fdim[0], fdim[1], fdim[2], fdim[3]], 'float32');

			const pdim = partAffinityField?.dims;

			const partAffinityFieldTensor =
				tf.tensor4d(
					partAffinityField?.data, [pdim[0], pdim[1], pdim[2], pdim[3]], 'float32');

			const hdim = heatmaps.dims;

			const heatmapsTensor =
				tf.tensor4d(
					heatmaps?.data, [hdim[0], hdim[1], hdim[2], hdim[3]], 'float32');
		}

		// 1차원 배열에 차원 값을 가진 데이터
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

	return (
		<Wrapper
			muted
			autoPlay
			ref = { elementRef }
			width = { width }
			height = { height }
		/>
	);
}

export default Webcam;
