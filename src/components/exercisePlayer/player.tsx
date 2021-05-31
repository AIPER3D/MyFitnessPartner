const fs = window.require('fs');
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
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
import moment from 'moment';
import { RecordDTO } from '../../db/DTO';

type Props = {
	routineDAO: RoutineDAO;
	videoDAO: VideoDAO[];
	onEnded: (record: RecordDAO) => void;
};


export const recordContext = createContext<RecordDAO>({
	id: (new RecordDTO()).getNewId(),
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
});

function Player({ routineDAO, videoDAO, onEnded }: Props) {
	const { ipcRenderer } = window.require('electron');


	// record 초기화
	const recordDAO = useContext(recordContext);
	const _playerContext = useContext(playerContext);
	_playerContext.totalSeq = routineDAO['videos'].length;

	const playTime = useRef(moment().unix());

	recordDAO.createTime = Number(moment().format('YYYYMMDD'));
	recordDAO.routineId = routineDAO['id'];
	recordDAO.routineName = routineDAO['name'];

	const requestRef = useRef<number>();

	const [playerLoaded, setPlayerLoaded] = useState<boolean>(false);
	const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
	const [webcamLoaded, setWebcamLoaded] = useState<boolean>(false);

	const videoRef = useRef<HTMLVideoElement>(null);

	const seqRef = useRef(0);
	const [seq, setSeq] = useState<number>(seqRef.current);

	const [poseLabel, setPoseLabel] = useState<string>('');
	const [poseTime, setPoseTime] = useState<number>(0);

	const [poseSimilarity, setPoseSimilarity] = useState<any>(0);

	const inputWidth = 224;
	const inputHeight = 224;

	const widthScaleRatio = window.innerWidth / inputWidth;
	const heightScaleRatio = (window.innerHeight - 100) / inputHeight;

	const [poses, setPoses] = useState<any>(null);

	// const [poseNet, setPoseNet] = useState<any>(null);

	const poseNet = useRef<any>();

	// let poseNet: posenet.PoseNet;

	// 최초 모델 로딩
	useEffect(() => {
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

			console.log('loading model');

			setPlayerLoaded(true);
		})().then( () => {
			requestRef.current = requestAnimationFrame(capture);
		});

		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}

			if (poseNet.current != null) {
				poseNet.current.dispose();
				console.log('dispose posenet');
			}

			ipcRenderer.removeAllListeners('pose-similarity');
		};
	}, []);

	// 비디오 로딩
	useEffect(() => {
		setVideoLoaded(false);
		if (seq < routineDAO['videos'].length) {
			load();
		} else {
			// playTime 기록
			recordDAO.playTime = (moment().unix() - playTime.current) / 60; // minute
			onEnded(recordDAO);
		}
	}, [seq]);

	// 로딩 완료 체크
	useEffect(() => {
		console.log(playerLoaded + '/' + videoLoaded + '/' + webcamLoaded);

		if (!playerLoaded || !videoLoaded || !webcamLoaded) return;

		(async () => {
			if (videoRef.current == null) return;
			await videoRef.current.play();
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
		videoRef.current.controls = true;
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

	const capture = async () => {
		try {
			if (videoRef.current != null) {
				// if (videoRef == null) return;
			// 1. resize video element
			// videoRef.width = inputWidth;
			// videoRef.height = inputHeight;

				const resizedTensor = tf.tidy(() : tf.Tensor3D => {
				// // 1. get tensor from video element
					const tensor = tf.browser.fromPixels(videoRef.current as HTMLVideoElement);

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

				// const width = tensor.shape[1];
				// const height = tensor.shape[0];
				const width = videoRef.current.videoWidth;
				const height = videoRef.current.videoHeight;
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

				if (inferencedPoses.length >= 1) {
					ipcRenderer.send('video-poses', inferencedPoses);
				}

				// 4. set keypoints and skelecton
				setPoses(inferencedPoses);
			}
		} catch (e) {
			// requestRef.current = requestAnimationFrame(capture);
			console.log(e);
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
