import React, {useState, useRef, useEffect} from 'react';
import styled, { css } from 'styled-components';

import { NavigatorTop, NavigatorBottom, PIP } from './';
import { VideoDAO, RoutineDAO } from '../../db/DAO';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import {iamgeDataToTensor, imageFromVideo, resizeImage} from '../../util/video-util';
import { Stage, Graphics } from '@inlet/react-pixi';

type Props = {
	routine: RoutineDAO;
	video: VideoDAO[];
};

const colorCode = {
	'dark': '#2C363F',
	'pink': '#E75A7C',
	'white': '#F2F5EA',
	'blue': '#48ACF0',
};

const Container = styled.div`
	margin: 0px;
	padding: 0px;
	
	overflow:hidden;
	background-color: #000000;
`;

const Video = styled.video`
	position: absolute;
	display: block;
	
	top: 50px;
	left: 0px;
	width: calc(100vw);
	height: calc(100vh - 100px);
	margin: 0px;
	padding: 0px;
	
	overflow:hidden;
	background-color: #000000;
`;

function Player({ routine, video } : Props) {
	const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
	const [seq, setSeq] = useState<number>(0);

	let widthScaleRatio : number = 0;
	let	heightScaleRatio : number = 0;
	const inputWidth = 512;
	const inputHeight = 512;

	const [keypoints, setKeypoints] = useState<any>(null);

	let net : any;

	useEffect(() => {
		if (videoRef == null) return;
		if (seq < video.length) {
			loadModel();
			load(seq);
		} else end();
	}, [videoRef, seq]);


	async function loadModel() {
		net = await posenet.load({
			architecture: 'MobileNetV1',
			outputStride: 16,
			inputResolution: { width: inputWidth, height: inputHeight },
			multiplier: 1,
			quantBytes: 2,
		});
	}

	function load(seq : number) {
		if (videoRef == null) return;

		const file = window.api.fs.readFileSync('./files/videos/' + video[seq]['id'] + '.vd');
		const uint8Array = new Uint8Array(file);
		const arrayBuffer = uint8Array.buffer;
		const blob = new Blob([arrayBuffer]);
		const url = URL.createObjectURL(blob);

		widthScaleRatio = videoRef.videoWidth / inputWidth;
		heightScaleRatio = videoRef.videoHeight / inputHeight;

		videoRef.controls = false;
		videoRef.playsInline = true;
		videoRef.src = url;
		videoRef.volume = 0.2;

		videoRef.play()
			.then(async () => {
				// while ( !videoRef.paused &&
				// 		videoRef.currentTime < videoRef.duration ) {
				// 	await capture();
				// }
				capture();
			})
			.catch(() => {

			});

		videoRef.addEventListener('ended', () => {
			if (videoRef == null) return;
			setSeq(seq + 1);
		});
	}

	const capture = async () => {
		// 1. get image from video
		if (videoRef == null) return;

		// const image = imageFromVideo(videoRef);
		// const tensor = iamgeDataToTensor(image);
		// console.log(tensor);

		// // 2. resize image
		// const resizedImage = resizeImage(tensor, { width: 512, height: 256});

		// // 3. inference pose
		const pose = await net.estimateSinglePose(videoRef, {
			flipHorizontal: false,
		});

		console.log(pose);

		// // 4. upscale pose to video resolution
		// pose.keypoints.map( (keypoints : any) => {
		// 	keypoints.position.x *= widthScaleRatio;
		// 	keypoints.position.y *= heightScaleRatio;
		// });

		// // 5. setKeypoints
		// setKeypoints(pose.keypoints);
	};

	const drawKeypoints = React.useCallback( (graphics) => {
		graphics.clear();

		if (keypoints == null) return;

		for (let i=0; i<keypoints.length; i++) {
			const x = keypoints[i].position.x;
			const y = keypoints[i].position.y;

			graphics.beginFill(0xffffff);
			graphics.drawCircle(x, y, 5);
			graphics.endFill();
		}
	}, [keypoints]);

	function end() {
		console.log('끝');
	}

	const stageProps = {
		width: videoRef?.videoWidth,
		height: videoRef?.videoHeight,
		options: {
			backgroundAlpha: 0,
			antialias: true,
			backgroundColor: 0x000000,
		},
	};

	return (
		<Container>
			<NavigatorTop
				routine = { routine }
				seq = { seq + 1 }
			/>

			<Video ref={ (ref) => {
				setVideoRef(ref);
			} } />

			<PixiStage {...stageProps}>
				<Graphics draw={drawKeypoints}/>
			</PixiStage>

			<NavigatorBottom
				videoRef = { videoRef }
			/>
			<PIP/>
		</Container>
	);
}

Player.defaultProps = {

};

const PixiStage = styled(Stage)`
	position: absolute;

	top: 0px;
	left: 0px;

	z-index : 800;
`;

export default Player;
