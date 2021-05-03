import React, {useState, useRef, useEffect} from 'react';
import styled, { css } from 'styled-components';

import { NavigatorTop, NavigatorBottom, PIP } from './';
import { VideoDAO, RoutineDAO } from '../../db/DAO';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { Stage, Graphics } from '@inlet/react-pixi';
import { drawSegment, getSkeleton } from '../../util/posenet-utils';

type Props = {
	routine: RoutineDAO;
	video: VideoDAO[];
};

function Player({ routine, video } : Props) {
	const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
	const [seq, setSeq] = useState<number>(0);

	const inputWidth = 256;
	const inputHeight = 256;

	const widthScaleRatio = window.innerWidth / inputWidth;
	const heightScaleRatio = (window.innerHeight - 100) / inputHeight;

	const [pose, setPose] = useState<any>(null);

	let net : any;

	useEffect(() => {
		if (videoRef == null) return;
		if (seq < video.length) {
			load(seq);
		} else {
			end();
		}
	}, [videoRef, seq]);

	// load video and model
	async function load(seq : number) {
		if (videoRef == null) return;

		// 1. file loading
		const file = window.api.fs.readFileSync('./files/videos/' + video[seq]['id'] + '.vd');
		const uint8Array = new Uint8Array(file);
		const arrayBuffer = uint8Array.buffer;
		const blob = new Blob([arrayBuffer]);
		const url = URL.createObjectURL(blob);

		// 2. video property settings
		videoRef.controls = false;
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

	const capture = async () => {
		if (videoRef == null) return;

		// 1. resize video element
		videoRef.width = inputWidth;
		videoRef.height = inputHeight;

		// 2. inference iamge
		const inferencedPose = await net.estimateSinglePose(videoRef, {
			flipHorizontal: false,
		});

		if (inferencedPose.score < 0.2) return;

		// 3. upscale keypoints to webcam resolution
		inferencedPose.keypoints.map( (keypoints : any) => {
			keypoints.position.x *= widthScaleRatio;
			keypoints.position.y *= heightScaleRatio;
		});
		// 4. set keypoints and skelecton
		setPose(inferencedPose);

		console.log(pose);

		// 5. recursion capture()
		requestAnimationFrame(capture);
	};

	const drawKeypoints = (graphics : any, keypoints : any, minConfidence : number) => {
		for (let i=0; i<keypoints.length; i++) {
			const keypoint = keypoints[i];

			if (keypoint.score < minConfidence) {
				continue;
			}

			const { y, x } = keypoint.position;

			drawPoint(graphics, y, x, 5, 0xffffff);
		}
	};

	function drawPoint(graphics : any, x : number, y : number, raidus : number, color : number) {
		graphics.beginFill(color);
		graphics.drawCircle(x, y, raidus);
		graphics.endFill();
	}

	function drawLine(graphics : any, [ax, ay] : [number, number],
		[bx, by] : [number, number], thickness : number, color : number) {
		graphics.beginFill();
		graphics.lineStyle(thickness, color);
		graphics.moveTo(ax, ay);
		graphics.lineTo(bx, by);
		graphics.endFill();
	}

	function drawSkeleton(graphics : any, keypoints : any, minConfidence : number, ) {
		const skeleton = posenet.getAdjacentKeyPoints(keypoints, minConfidence);

		function toTuple({y, x} : {y : any, x : any}) {
			return [y, x];
		}

		skeleton.forEach(( keypoints) => {
			// const ax = keypoints[0].position.x;
			// const ay = keypoints[0].position.y;

			console.log(keypoints[0].position);

			// drawLine(
			// graphics, [ax, ay], toTuple(keypoints[1].position), 2, 0xffffff
			// );
		});
	}

	// draw keypoints of inferenced pose
	const draw = React.useCallback( (graphics) => {
		graphics.clear();

		if (pose == null) return;

		const keypoints = pose.keypoints;
		const skeleton = getSkeleton(pose);

		drawKeypoints(keypoints, 0.2, graphics);
		drawSkeleton(skeleton, 0.2, graphics);
	}, [pose]);

	function end() {
		console.log('끝');
	}

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
				routine = { routine }
				seq = { seq + 1 }
			/>

			<Video ref={ (ref) => {
				setVideoRef(ref);
			} } />

			<PixiStage {...stageProps}>
				<Graphics draw={draw}/>
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
	display: block;

	top: 50px;
	left: 0px;

	/* width: calc(100vw); */
	/* height: calc(100vh - 100px); */

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
