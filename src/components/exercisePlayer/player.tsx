import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

import { NavigatorTop, NavigatorBottom, PIP } from './';
import { VideoDAO, RoutineDAO, RecordDAO } from '../../db/DAO';

import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { Stage, Graphics } from '@inlet/react-pixi';
import { drawKeypoints, drawSkeleton} from '../../util/posenet-utils';

type Props = {
	routine: RoutineDAO;
	video: VideoDAO[];
	onEnded: (record: RecordDAO) => void;
};

function Player({ routine, video }: Props) {
	const [isLoading, setLoading] = useState<boolean>(false);
	const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
	const [seq, setSeq] = useState<number>(0);

	const inputWidth = 256;
	const inputHeight = 256;

	const widthScaleRatio = window.innerWidth / inputWidth;
	const heightScaleRatio = (window.innerHeight - 100) / inputHeight;

	const [poses, setPose] = useState<any>(null);

	let net: any;

	useEffect(() => {
		// 1. loding true
		setLoading(true);

		// 2. when all task is ready, set loading false
		setTimeout( () => {
			setLoading(false);
		}, 8000);

		if (videoRef == null) return;
		if (seq < video.length) {
			load(seq);
		} else {
			end();
		}
	}, [videoRef, seq]);

	// load video and model
	async function load(seq: number) {
		if (videoRef == null) return;

		// 1. file loading
		const file = window.api.fs.readFileSync('./files/videos/' + video[seq]['id'] + '.vd');
		const uint8Array = new Uint8Array(file);
		const arrayBuffer = uint8Array.buffer;
		const blob = new Blob([arrayBuffer]);
		const url = URL.createObjectURL(blob);

		videoRef.controls = true;
		videoRef.playsInline = true;
		videoRef.src = url;
		videoRef.volume = 0.2;

		// 3. posenet load
		net = await posenet.load({
			architecture: 'MobileNetV1',
			outputStride: 16,
			inputResolution: { width: inputWidth, height: inputHeight },
			multiplier: 1,
			quantBytes: 2,
		});

		// 4. play video
		videoRef.play()
			.then(async () => {
				// 5. capture image and detect pose while video playing
				await capture();
			})
			.catch(() => {

			});

		// 5. when video ended play next video
		videoRef.addEventListener('ended', () => {
			if (videoRef == null) return;
			setSeq(seq + 1);
		});
	}

	function end() {
		console.log('끝');
	}

	const capture = async () => {
		if (videoRef == null) return;

		// 1. resize video element
		videoRef.width = inputWidth;
		videoRef.height = inputHeight;

		// 2. inference iamge
		const inferencedPoses = await net.estimateMultiplePoses(videoRef, {
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

		// 4. set keypoints and skelecton
		setPose(inferencedPoses);

		// 5. recursion capture()
		requestAnimationFrame(capture);
	};

	// draw keypoints of inferenced pose
	const draw = React.useCallback((graphics) => {
		graphics.clear();

		if (poses == null) return;

		poses.forEach(({ score, keypoints }: { score: number, keypoints: [] }) => {
			if (score >= 0.5) {
				drawKeypoints(graphics, keypoints, 0.5);
				drawSkeleton(graphics, keypoints, 0.5);
			}
		});
	}, [poses]);

	const stageProps = {
		width: window.innerWidth,
		height: window.innerHeight - 100,
		options: {
			backgroundAlpha: 0,
			antialias: true,
			backgroundColor: 0x000000,
		},
	};

	return (
		<Container>
			<NavigatorTop
				routine={routine}
				seq={seq + 1}
			/>

			<Video ref={(ref) => {
				setVideoRef(ref);
			}} />

			<PixiStage {...stageProps}>
				<Graphics draw={draw} />
			</PixiStage>

			<NavigatorBottom
				videoRef={videoRef}
			/>
			<PIP />
		</Container>
	);
}

Player.defaultProps = {

};

const PixiStage = styled(Stage)`
	position: absolute;
	display: block;

	top: 50px;
	left: 0px;

	margin: 0px;
	padding: 0px;

	overflow:hidden;
`;

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

export default Player;
