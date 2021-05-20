const fs = window.require('fs');
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { NavigatorTop, NavigatorMeter, NavigatorBottom, PIP } from './';
import { VideoDAO, RoutineDAO, RecordDAO } from '../../db/DAO';

import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';

import { Stage, Graphics } from '@inlet/react-pixi';
import { drawKeypoints, drawSkeleton, getSquareBound } from '../../utils/posenet-utils';

import { css } from '@emotion/react';
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

	const requestRef = useRef<number>();

	const [isLoading, setLoading] = useState<boolean>(true);
	const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
	const [seq, setSeq] = useState<number>(0);
	const [length, setLength] = useState<number>(0);

	const [poseLabel, setPoseLabel] = useState<string>('');
	const [poseStart, setPoseStart] = useState<number>(0);
	const [poseEnd, setPoseEnd] = useState<number>(0);
	const [poseSimilarity, setPoseSimilarity] = useState<any>(0);

	const inputWidth = 256;
	const inputHeight = 256;

	const widthScaleRatio = window.innerWidth / inputWidth;
	const heightScaleRatio = (window.innerHeight - 100) / inputHeight;

	const [poses, setPose] = useState<any>(null);

	let poseNet: any;


	useEffect(() => {
		setLength(Object.keys(video).length);
		if (length <= 0) return;

		// 1. posenet load
		(async () => {
			poseNet = await posenet.load({
				architecture: 'MobileNetV1',
				outputStride: 16,
				inputResolution: { width: inputWidth, height: inputHeight },
				multiplier: 1,
				quantBytes: 2,
			});
		})();

		// 2. when all task is ready, set loading false
		if (videoRef == null) return;
		if (seq < length) {
			load(seq);
		} else {
			onEnded(record);
		}

		ipcRenderer.on('pose-similarity', (event : any, args : any) => {
			setPoseSimilarity(Math.abs(args));
			// console.log(args);
		});

		return () => {
			// if (requestRef.current) {
			// 	cancelAnimationFrame(requestRef.current);
			// }
		};
	}, [videoRef, length, seq]);

	// load video and model
	async function load(seq: number) {
		if (videoRef == null) return;

		// 1. file loading
		const file = fs.readFileSync('./files/videos/' + video[routine['videos'][seq]]['id'] + '.vd');
		const uint8Array = new Uint8Array(file);
		const arrayBuffer = uint8Array.buffer;
		const blob = new Blob([arrayBuffer]);
		const url = URL.createObjectURL(blob);

		// 2. settings
		videoRef.controls = true;
		videoRef.playsInline = true;
		videoRef.src = url;
		videoRef.volume = 0.2;

		setLoading(false);

		// 4. play video
		await videoRef.play();
		if (seq == 0) {
			videoRef.addEventListener('timeupdate', () => {
				for (let i = 0; i < video[routine['videos'][seq]]['timeline'].length; i++) {
					if (videoRef.currentTime >= video[routine['videos'][seq]]['timeline'][i]['start'] &&
						videoRef.currentTime <= video[routine['videos'][seq]]['timeline'][i]['end']) {
						setPoseLabel(video[routine['videos'][seq]]['timeline'][i]['name']);
						setPoseStart(video[routine['videos'][seq]]['timeline'][i]['start']);
						setPoseEnd(video[routine['videos'][seq]]['timeline'][i]['end']);
					}
				}
			});
		}


		// 5. when video ended play next video
		videoRef.addEventListener('ended', () => {
			if (videoRef == null) return;
			setSeq(seq + 1);
		});

		videoRef.addEventListener('loadeddata', () => {
			// 5. capture image and detect pose while video playing
			requestRef.current = requestAnimationFrame(capture);
		});
	}

	function end() {
		console.log('끝');
	}

	let count = 0;

	const capture = async () => {
		if (videoRef == null) return;

		if (poseNet == null) {
			requestRef.current = requestAnimationFrame(capture);
			return;
		}
		// 1. resize video element
		videoRef.width = inputWidth;
		videoRef.height = inputHeight;

		// // 1. get tensor from video element
		// const tensor = (await tf.browser.fromPixelsAsync(videoRef));

		// // 2. resize tensor
		// const boundingBox = getSquareBound(videoRef.width, videoRef.height);
		// const expandedTensor : tf.Tensor<tf.Rank.R4> = tensor.expandDims();
		// const resizedTensor = tf.image.cropAndResize(expandedTensor, [boundingBox], [0], [224, 224]);

		// 2. inference iamge
		const inferencedPoses = await poseNet.estimateMultiplePoses(videoRef, {
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


		if (inferencedPoses.length >= 1 &&
			count % 5 == 0) {
			ipcRenderer.send('video-poses', inferencedPoses);
		}
		count++;

		// 4. set keypoints and skelecton
		setPose(inferencedPoses);

		// 5. recursion capture()
		requestRef.current = requestAnimationFrame(capture);
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

						<NavigatorMeter
							exercise={ poseLabel }
							time={ videoRef != null ? (videoRef.currentTime - poseStart) / (poseEnd - poseStart) : 0 }
							accuracy={ poseSimilarity }
						/>

						<PixiStage {...stageProps}>
							<Graphics draw={draw} />
						</PixiStage>

						<NavigatorBottom
							videoRef={videoRef}
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
