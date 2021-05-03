import React, { useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import styled from 'styled-components';
import { Graphics, Stage } from '@inlet/react-pixi';

type Props = {
	type : string
	input: HTMLVideoElement | HTMLImageElement;
	width: number;
	height: number;

	flipHorizontal : boolean;
	showSkeleton : boolean;
	showPoints : boolean;

	minPoseConfidence : number;
	minPartConfidence : number;
	maxPoseDetection : number;
	nmsRadius : number;
	outputStride : number;
	imageScaleFactor : number;
	skeletonColor : number;
	skeletonLineWidth : number;

	loadingText : string;
};

function PoseNet({
	type = 'webcam',
	input,
	width,
	height,
	flipHorizontal = true,

	showSkeleton = true,
	showPoints = true,

	minPoseConfidence = 0.1,
	minPartConfidence = 0.5,
	maxPoseDetection = 3,
	nmsRadius = 20,
	outputStride = 16,
	imageScaleFactor = 0.5,
	skeletonColor = 0xffffff,
	skeletonLineWidth = 2,
	loadingText = '로딩중',
}:Props) {
	let net : any;

	const [inputWidth, inputHeight] = [256, 256];

	const stageProps = {
		width: width,
		height: height,
		options: {
			backgroundAlpha: 0,
			antialias: true,
			backgroundColor: 0x000000,
		},
	};

	const loadModel = async () => {
		net = await posenet.load({
			architecture: 'MobileNetV1',
			outputStride: 16,
			inputResolution: { width: inputWidth, height: inputWidth },
			multiplier: 1,
			quantBytes: 2,
		});
	};

	const poseDetect = async () => {
		if (type === 'video') {
			input.width = inputWidth;
			input.height = inputHeight;
		}

		const poses = await net.estimateMultiplePoses(input, {
			flipHorizontal: flipHorizontal,
			maxDetections: maxPoseDetection,
			scoreThreshold: 0.5,
			nmsRadius: nmsRadius,
		});
	};

	const draw = useCallback((graphics : any) => {

	}, []);

	return (
		<Wrapper>
			<Video/>

			<PixiStage {...stageProps}>
				<Graphics draw={draw}/>
			</PixiStage>
		</Wrapper>
	);
}

const Wrapper = styled.div`

`;

const Video = styled.video`

`;

const PixiStage = styled(Stage)`
`;

export default PoseNet;
