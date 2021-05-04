const fs = window.require('fs');
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { NavigatorTop, NavigatorBottom, PIP } from './';
import { VideoDAO, RoutineDAO, RecordDAO } from '../../db/DAO';

import * as posenet from '@tensorflow-models/posenet';
import { Stage, Graphics } from '@inlet/react-pixi';
import { drawKeypoints, drawSkeleton } from '../../util/posenet-utils';

import { css } from '@emotion/core';
import PuffLoader from 'react-spinners/PuffLoader';

type Props = {
	routine: RoutineDAO;
	video: VideoDAO[];
	onEnded: (record: RecordDAO) => void;
};

function Player({ routine, video, onEnded }: Props) {
	const { ipcRenderer } = window.require('electron');

	const record: RecordDAO = {
		id: 0,
		time: new Date().getTime(),
		routineId: routine['id'],
		routineName: routine['name'],
	};

	const [isLoading, setLoading] = useState<boolean>(true);
	const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
	const [seq, setSeq] = useState<number>(0);

	const [poseSimilarity, setPoseSimilarity] = useState<any>(0);

	const inputWidth = 256;
	const inputHeight = 256;

	const widthScaleRatio = window.innerWidth / inputWidth;
	const heightScaleRatio = (window.innerHeight - 100) / inputHeight;

	const [poses, setPose] = useState<any>(null);

	let net: any;


	useEffect(() => {
		// 1. posenet load
		(async () => {
			net = await posenet.load({
				architecture: 'MobileNetV1',
				outputStride: 16,
				inputResolution: { width: inputWidth, height: inputHeight },
				multiplier: 1,
				quantBytes: 2,
			});
		})();

		// 2. when all task is ready, set loading false
		if (videoRef == null) return;
		if (seq < video.length) {
			load(seq);
		} else {
			onEnded(record);
		}

		ipcRenderer.on('pose-similarity', (event, args) => {
			setPoseSimilarity(args);
			console.log(args);
		});
	}, [videoRef, seq]);

	// load video and model
	async function load(seq: number) {
		if (videoRef == null) return;

		// 1. file loading
		const file = fs.readFileSync('./files/videos/' + video[seq]['id'] + '.vd');
		const uint8Array = new Uint8Array(file);
		const arrayBuffer = uint8Array.buffer;
		const blob = new Blob([arrayBuffer]);
		const url = URL.createObjectURL(blob);

		// 2. settings
		videoRef.controls = false;
		videoRef.playsInline = true;
		videoRef.src = url;
		videoRef.volume = 0.2;

		setLoading(false);

		// 4. play video
		await videoRef.play();

		// 5. capture image and detect pose while video playing
		await capture();

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

		if (net == null) {
			requestAnimationFrame(capture);
			return;
		}

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

		if (inferencedPoses.length >= 1) {
			ipcRenderer.send('video-poses', inferencedPoses);


			// 4. set keypoints and skelecton
			setPose(inferencedPoses);

			// 5. recursion capture()
			requestAnimationFrame(capture);
		}
	};

	// draw keypoints of inferenced pose
	const draw = React.useCallback((graphics) => {
		graphics.clear();

		if (poses == null) return;

		poses.forEach(({ score, keypoints }: { score: number, keypoints: [] }) => {
			if (score >= 0.3) {
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
			{
				isLoading ? (
					<PuffLoader css={Loader} color={'#E75A7C'} loading={isLoading} size={300} />
				) : (
					<>
						<NavigatorTop
							routine={routine}
							seq={seq + 1}
						/>

						<PixiStage {...stageProps}>
							<Graphics draw={draw} />
						</PixiStage>

						<NavigatorBottom
							videoRef={videoRef}
							accuracy={ 0 }
						/>
						<PIP />
					</>
				)
			}

			<Video ref={setVideoRef} />

		</Container>
	);
}

const Loader = css`
	z-index : 1000;
`;

const PixiStage = styled(Stage)`
	position: absolute;
	display: block;

	top: 50px;
	left: 0px;

	margin: 0px;
	padding: 0px;

	z-index : 1001;

	overflow:hidden;
`;

const colorCode = {
	'dark': '#2C363F',
	'pink': '#E75A7C',
	'white': '#F2F5EA',
	'blue': '#48ACF0',
};

const Container = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	margin: 0px;
	padding: 0px;

	min-height: 100vh;
	
	overflow:hidden;
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
