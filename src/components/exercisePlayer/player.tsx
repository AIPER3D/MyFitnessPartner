import React, {useState, useRef, useEffect} from 'react';
import styled, { css } from 'styled-components';

import { NavigatorTop, NavigatorBottom, PIP } from './';
import { VideoDAO, RoutineDAO } from '../../db/DAO';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';

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

	const inputSclaeRatio : number = 0;
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

	// const imageToByteArray = (image, )

	const imageToTensor = (image : any, NUMBER_OF_CHANNELS : number) => {

	};

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

		videoRef.controls = false;
		videoRef.playsInline = true;
		videoRef.src = url;
		videoRef.volume = 0.2;

		videoRef.play()
			.then(async () => {
				// setInterval(capture, 100);
			})
			.catch(() => {

			});

		videoRef.addEventListener('ended', () => {
			if (videoRef == null) return;
			setSeq(seq + 1);
		});
	}

	const capture = async () => {
		if (videoRef == null) return;

		// 1. initializa video frames
		const videoFramer = await tf.data.webcam(videoRef, {
			resizeWidth: inputWidth,
			resizeHeight: inputHeight,
		});

		// 2. get video keyframe
		const image = await videoFramer.capture();

		// 3. inference pose
		const pose = await net.estimateSinglePose(image, {
			flipHorizontal: false,
		});

		// 4. upscale pose to video resolution

		// 5. setKeypoints
		setKeypoints(pose.keypoints);

		console.log(keypoints);

		image.dispose();
		await tf.nextFrame();
	};

	function end() {
		console.log('끝');
	}

	return (
		<Container>
			<NavigatorTop
				routine = { routine }
				seq = { seq + 1 }
			/>
			<Video ref={ (ref) => {
				setVideoRef(ref);
			} } />
			<NavigatorBottom
				videoRef = { videoRef }
			/>
			<PIP/>
		</Container>
	);
}

Player.defaultProps = {

};

export default Player;
