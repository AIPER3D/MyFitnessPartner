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
import { tensorToImage } from '../../utils/video-util';

type Props = {
	routineDAO: RoutineDAO;
	videoDAO: VideoDAO[];
	onEnded: (record: RecordDAO) => void;
};

function Player({ routineDAO, videoDAO, onEnded }: Props) {
	const { ipcRenderer } = window.require('electron');

	const record: RecordDAO = {
		id: 0,
		routineId: routineDAO['id'],
		routineName: routineDAO['name'],
		recordExercise: [],
	};

	const requestRef = useRef<number>();

	const [isLoading, setLoading] = useState<boolean>(true);
	const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

	const value = useRef(0);
	const [seq, setSeq] = useState<number>(value.current);

	const [poseLabel, setPoseLabel] = useState<string>('');
	const [poseTime, setPoseTime] = useState<number>(0);

	const [poseSimilarity, setPoseSimilarity] = useState<any>(0);

	const inputWidth = 224;
	const inputHeight = 224;

	const widthScaleRatio = window.innerWidth / inputWidth;
	const heightScaleRatio = (window.innerHeight - 100) / inputHeight;

	const [poses, setPoses] = useState<any>(null);

	let poseNet: posenet.PoseNet;


	useEffect(() => {
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
		// if (videoRef == null) return;
		if (seq < routineDAO['videos'].length) {
			load();
		} else {
			onEnded(record);
		}
	}, [videoRef, seq]);

	useEffect(() => {
		// if (requestRef.current) {
		// 	cancelAnimationFrame(requestRef.current);
		// }

		requestRef.current = requestAnimationFrame(capture);

		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, [videoRef]);

	ipcRenderer.on('pose-similarity', (event: any, args: any) => {
		setPoseSimilarity(Math.abs(args));
	});

	// load video and model
	async function load() {
		if (videoRef == null) return;

		// 1. file loading
		const file = fs.readFileSync('./files/videos/' + videoDAO[routineDAO['videos'][value.current]]['id'] + '.vd');
		const uint8Array = new Uint8Array(file);
		const arrayBuffer = uint8Array.buffer;
		const blob = new Blob([arrayBuffer]);
		const url = URL.createObjectURL(blob);

		// 2. settings
		videoRef.controls = true;
		videoRef.playsInline = true;
		videoRef.src = url;
		videoRef.volume = 0.2;

		// 3. play video
		await videoRef.play();

		if (seq == 0) {
			videoRef.addEventListener('timeupdate', () => {
				for (let i = 0; i < videoDAO[routineDAO['videos'][value.current]]['timeline'].length; i++) {
					const name = videoDAO[routineDAO['videos'][value.current]]['timeline'][i]['name'];
					const start = videoDAO[routineDAO['videos'][value.current]]['timeline'][i]['start'];
					const end = videoDAO[routineDAO['videos'][value.current]]['timeline'][i]['end'];

					if (videoRef.currentTime >= start &&
						videoRef.currentTime <= end) {
						setPoseLabel(name);
						setPoseTime((videoRef.currentTime - start) / (end - start));
					}
				}
			});

			// 5. when video ended play next video
			videoRef.addEventListener('ended', () => {
				value.current += 1;
				setSeq(value.current);
				// seq 0 -> 1 로 변경
			});
		}

		setLoading(false);
	}

	function end() {
		console.log('끝');
	}

	let count = 0;

	const capture = async () => {
		try {
			if (videoRef == null) return;
			// 1. resize video element
			// videoRef.width = inputWidth;
			// videoRef.height = inputHeight;

			const resizedTensor = tf.tidy(() : tf.Tensor3D => {
				// // 1. get tensor from video element
				const tensor = tf.browser.fromPixels(videoRef);

				// // 2. resize tensor
				const boundingBox = getSquareBound(tensor.shape[1], tensor.shape[0]);
				const expandedTensor : tf.Tensor4D = tensor.expandDims(0);

				const resizedTensor = tf.image.cropAndResize(
					expandedTensor,
					[boundingBox],
					[0], [inputHeight, inputWidth],
					'nearest');

				// return resizedTensor;
				return resizedTensor.reshape(resizedTensor.shape.slice(1) as [number, number, number]);
			});

			// 2. inference iamge
			const inferencedPoses = await poseNet.estimateMultiplePoses(resizedTensor, {
				flipHorizontal: false,
				maxDetections: 3,
				scoreThreshold: 0.5,
				nmsRadius: 20,
			});

			resizedTensor.dispose();

			// const width = tensor.shape[1];
			// const height = tensor.shape[0];
			const width = videoRef.videoWidth;
			const height = videoRef.videoHeight;
			const posSize = (width > height ? height : width);
			const dx = (width - posSize) / 2;

			// 3. upscale keypoints to webcam resolution
			inferencedPoses.forEach((pose) => {
				pose.keypoints.map((keypoint: any) => {
					keypoint.position.x *= posSize / inputWidth;
					keypoint.position.y *= posSize / inputHeight;

					keypoint.position.x += dx;
				});
			});

			if (inferencedPoses.length >= 1 &&
				count % 2 == 0) {
				ipcRenderer.send('video-poses', inferencedPoses);
			}
			count++;

			// 4. set keypoints and skelecton
			setPoses(inferencedPoses);
		} catch (e) {
			// requestRef.current = requestAnimationFrame(capture);
		}

		// 5. recursion capture()
		requestRef.current = requestAnimationFrame(capture);
	};

	// draw keypoints of inferenced pose
	const draw = React.useCallback((graphics) => {
		graphics.clear();

		if (poses == null) return;

		let i =0;
		const len = poses.length;
		while ( i < len) {
			if (poses[i].score >= 0.3) {
				drawKeypoints(graphics, poses[i].keypoints, 0.5);
				drawSkeleton(graphics, poses[i].keypoints, 0.5);
			}

			i++;
		}
	}, [poses]);

	const stageProps = {
		width: window.innerWidth,
		height: window.innerHeight-100,
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
							routine={routineDAO}
							seq={seq + 1}
						/>

						<NavigatorMeter
							exercise={poseLabel}
							time={poseTime}
							accuracy={poseSimilarity}
						/>

						<PixiStage {...stageProps}>
							<Graphics draw={draw} />
						</PixiStage>

						<NavigatorBottom
							videoRef={videoRef}
						/>
						<PIP poseLabel={poseLabel}/>
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

	background : #ffffff;

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
