const fs = window.require('fs');
import React, { useState, useRef, useEffect, createContext, useContext, useCallback } from 'react';
import styled from 'styled-components';

import { NavigatorTop, NavigatorMeter, NavigatorBottom, PIP } from './';
import { VideoDAO, RoutineDAO, RecordDAO } from '../../db/DAO';

import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';

import * as PIXI from 'pixi.js';

import { Stage, Graphics, useApp, AppConsumer } from '@inlet/react-pixi';
import { drawKeypoints, drawKeypoints2, drawSkeleton, drawSkeleton2, getSquareBound } from '../../utils/posenet-utils';

import { css } from '@emotion/react';
import PuffLoader from 'react-spinners/PuffLoader';
import { imageFromVideo, tensorToImage } from '../../utils/video-util';
import moment from 'moment';
import { RecordDTO } from '../../db/DTO';
import { timer } from '../../utils/bench-util';
import { _collectionNamePrimary } from 'rxdb';

type Props = {
	routineDAO: RoutineDAO;
	videoDAO: VideoDAO[];
	onEnded: (record: RecordDAO) => void;
};


export const recordContext = createContext<RecordDAO>({
	id: 0,
	playTime: 0,
	createTime: 0,
	routineId: 0,
	routineName: '',
	recordExercise: [],
});

export const playerContext = createContext({
	poseLabel: '',
	currentSeq: 0,
	totalSeq: 0,
	recordEended: false,
});

function Player({ routineDAO, videoDAO, onEnded }: Props) {
	const { ipcRenderer } = window.require('electron');

	// record 초기화
	const recordDAO = useContext(recordContext);

	// player context 초기화
	const _playerContext = useContext(playerContext);

	// 총 운동 시간
	const playTime = useRef(moment().unix());
	const requestRef = useRef<number>();

	const [playerLoaded, setPlayerLoaded] = useState<boolean>(false);
	const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
	const [webcamLoaded, setWebcamLoaded] = useState<boolean>(false);

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const seqRef = useRef(0);
	const [seq, setSeq] = useState<number>(seqRef.current);

	const [poseLabel, setPoseLabel] = useState<string>('');
	const [poseTime, setPoseTime] = useState<number>(0);

	const [poseSimilarity, setPoseSimilarity] = useState<any>(0);

	const inputWidth = 257;
	const inputHeight = 257;

	const poses = useRef<any>(null);
	const poseNet = useRef<any>();

	const endRef = useRef<boolean>(false);


	// 최초 모델 로딩
	useEffect(() => {
		// 최초 레코드 초기화
		recordDAO.id = (new RecordDTO()).getNewId();
		recordDAO.playTime = 0;
		recordDAO.createTime = 0;
		recordDAO.routineId = 0;
		recordDAO.routineName = '';
		recordDAO.recordExercise = [];

		_playerContext.totalSeq = routineDAO['videos'].length;
		_playerContext.poseLabel = '';
		_playerContext.currentSeq = 0;
		_playerContext.recordEended = false;

		(async () => {
			setPlayerLoaded(false);

			// setPoseNet();
			poseNet.current = await posenet.load({
				architecture: 'MobileNetV1',
				outputStride: 16,
				inputResolution: { width: inputWidth, height: inputHeight },
				multiplier: 1,
				quantBytes: 2,
			});

			setPlayerLoaded(true);
		})().then( () => {
			requestRef.current = requestAnimationFrame(capture);
		});

		return () => {
			if (requestRef.current) {
				endRef.current = true;
				cancelAnimationFrame(requestRef.current);
			}

			if (poseNet.current != null) {
				poseNet.current.dispose();
			}

			ipcRenderer.removeAllListeners('pose-similarity');
		};
	}, []);

	// 비디오 로딩
	useEffect(() => {
		setVideoLoaded(false);
		if (seqRef.current < routineDAO['videos'].length) {
			load();
		} else {
			_playerContext.poseLabel = 'end';
		}
	}, [seq]);

	useEffect( () => {
		if (_playerContext.recordEended) {
			recordDAO.playTime = (moment().unix() - playTime.current) / 60; // minute
			onEnded(recordDAO);
		}
	}, [_playerContext.recordEended]);

	// 로딩 완료 체크
	useEffect(() => {
		console.log(playerLoaded + '/' + videoLoaded + '/' + webcamLoaded);

		if (!playerLoaded || !videoLoaded || !webcamLoaded) return;

		(async () => {
			if (videoRef.current == null) return;

			if (playerLoaded &&
				videoLoaded &&
				webcamLoaded &&
				seqRef.current < routineDAO['videos'].length) {
				await videoRef.current.play();
			}
		})();
	}, [seq, playerLoaded, videoLoaded, webcamLoaded]);

	ipcRenderer.on('pose-similarity', (event: any, args: any) => {
		setPoseSimilarity(Math.abs(args));
	});

	// Video Load and Play
	async function load() {
		if (videoRef.current == null) return;

		// 1. file loading
		const file = fs.readFileSync('./files/videos/' + videoDAO[routineDAO['videos'][seqRef.current]]['id'] + '.vd');
		const uint8Array = new Uint8Array(file);
		const arrayBuffer = uint8Array.buffer;
		const blob = new Blob([arrayBuffer]);
		const url = URL.createObjectURL(blob);

		// 2. settings
		videoRef.current.controls = false;
		videoRef.current.playsInline = true;
		videoRef.current.src = url;
		videoRef.current.volume = 0.2;

		if (seq == 0) {
			videoRef.current.addEventListener('timeupdate', () => {
				try {
					if (seqRef.current >= routineDAO['videos'].length) return;

					for (let i = 0; i < videoDAO[routineDAO['videos'][seqRef.current]]['timeline'].length; i++) {
						const name = videoDAO[routineDAO['videos'][seqRef.current]]['timeline'][i]['name'];
						const start = videoDAO[routineDAO['videos'][seqRef.current]]['timeline'][i]['start'];
						const end = videoDAO[routineDAO['videos'][seqRef.current]]['timeline'][i]['end'];

						if (videoRef.current != null) {
							if (videoRef.current.currentTime >= start &&
								videoRef.current.currentTime <= end) {
								setPoseLabel(name);
								_playerContext.poseLabel = name;
								setPoseTime((videoRef.current.currentTime - start) / (end - start));
							}
						}
					}
				} catch (e : any) {
					console.log('종료');
				}
			});

			// 5. when video ended play next video
			videoRef.current.addEventListener('ended', () => {
				if (videoRef.current != null) {
					videoRef.current.pause();
				}

				seqRef.current += 1;
				_playerContext.currentSeq = seqRef.current;
				setSeq(seqRef.current);
			});

			videoRef.current.addEventListener('loadeddata', () => {
				setVideoLoaded(true);
			});
		}
	}

	async function capture() {
		try {
			if (endRef.current) return;

			if (!videoRef.current) throw new Error('videoRef is null');

			videoRef.current.width = videoRef.current.videoWidth / 2;
			videoRef.current.height = videoRef.current.videoHeight / 2;

			const tensor = tf.browser.fromPixels(videoRef.current);

			const resizedTensor = tf.tidy(() : tf.Tensor3D => {
			// // 1. get tensor from video element

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
			const inferencedPoses = await poseNet.current.estimateMultiplePoses(resizedTensor, {
				flipHorizontal: false,
				maxDetections: 3,
				scoreThreshold: 0.5,
				nmsRadius: 20,
			});

			resizedTensor.dispose();
			tensor.dispose();

			if (inferencedPoses.length >= 1) {
				ipcRenderer.send('video-poses', inferencedPoses);
			}

			const width = window.innerWidth;
			const height = window.innerHeight - 100;
			const posSize = (width > height ? height : width);
			const dx = (width - posSize) / 2;

			// 3. upscale keypoints to webcam resolution
			inferencedPoses.forEach((pose : any) => {
				pose.keypoints.map((keypoint: any) => {
					keypoint.position.x *= posSize / inputWidth;
					keypoint.position.y *= posSize / inputHeight;

					keypoint.position.x += dx;
				});
			});


			// inferencedPoses.forEach((pose : any) => {
			// 	pose.keypoints.map((keypoint: any) => {
			// 		keypoint.position.x *= width / inputWidth;
			// 		keypoint.position.y *= height / inputHeight;

			// 		// keypoint.position.x += dx;
			// 	});
			// });

			// 4. set keypoints and skelecton
			// setPoses(inferencedPoses);
			// if (!canvasRef.current) throw new Error('canvasRef is null');

			// const ctx = canvasRef.current.getContext('2d');
			// if (!ctx) throw new Error('2d context');
			// ctx.canvas.width = videoRef.current.videoWidth;
			// ctx.canvas.height = videoRef.current.videoHeight;
			// ctx.scale(1, 1);

			// ctx.drawImage(videoRef.current, 0, 0);
			poses.current = inferencedPoses;
			// draw2(ctx);
		} catch (e) {
			console.log(e);
		}

		// 5. recursion capture()
		requestRef.current = requestAnimationFrame(capture);
	}

	// draw keypoints of inferenced pose
	const draw = React.useCallback((graphics : PIXI.Graphics) => {
		graphics.clear();

		if (poses.current == null) return;

		let i =0;
		const len = poses.current.length;
		while ( i < len) {
			if (poses.current[i].score >= 0.3) {
				drawKeypoints(graphics, poses.current[i].keypoints, 0.5);
				drawSkeleton(graphics, poses.current[i].keypoints, 0.5);
			}

			i++;
		}
	}, [poses.current]);

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
			<PuffLoader css={Loader} color={'#E75A7C'} loading={ !(playerLoaded && webcamLoaded) } size={300} />
			<BackPanel value = { (playerLoaded && webcamLoaded) ? 'none' : 'block' } />

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
				videoRef={videoRef.current}
			/>

			<PIP
				onLoaded={ setWebcamLoaded }
			/>

			{/* <Canvas ref = {canvasRef}>

			</Canvas> */}

			<Video ref={ videoRef } />

		</Container>
	);
}

const Loader = css`
	z-index: 1000020;
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

const Canvas = styled.canvas`
	position: absolute;
	display: block;

	top: 50px;
	left: 0px;
	width: calc(100vw);
	height: calc(100vh - 100px);
	margin: 0px;
	padding: 0px;
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

const BackPanel = styled.div.attrs((props: { value: string }) => ({
	style: {
		display: props.value,
	},
}))<{ value: string }>`
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
	
	z-index: 1000010;
	background-color: #000000;
	
	transition: 1s all;
`;

export default Player;
