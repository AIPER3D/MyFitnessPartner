const { BrowserView, BrowserWindow, app, ipcMain } = require('electron');
const tfjs = require('@tensorflow/tfjs-node');
const path = require('path');
const isDev = require('electron-is-dev');

const fs = require('fs');
const { createFFmpeg, fetchFile, createWorker } = require('@ffmpeg/ffmpeg');

let win;

let exerciseClassificationModel;

function createWindow() {
	win = new BrowserWindow({
		width: 1200,
		height: 800,
		backgroundColor: 'white',
		center: true,
		// fullscreen: true,
		webPreferences: {
			nodeIntegration: true,
			nodeIntegrationInWorker: true,
			enableRemoteModule: false,
			worldSafeExecuteJavaScript: true,
			contextIsolation: false,
			devTools: true,
		},
	});

	// win.loadURL(require('url').format({
	// 	protocol: 'file',
	// 	slashes: true,
	// 	pathname: require('path').join(__dirname, '../build/index.html'),
	// }));
	if (isDev) {
		// 개발 중에는 개발 도구에서 호스팅하는 주소에서 로드
		win.loadURL('http://localhost:3000');
		win.webContents.openDevTools();
	} else {
		// 프로덕션 환경에서는 패키지 내부 리소스에 접근
		win.loadFile(path.join(__dirname, '../build/index.html'));
	}
}

/*
require('electron-reload')(__dirname, {
	electron: require(
		path.join(__dirname, '../node_modules', '.bin', 'electron')
	),
	// hardResetMethod: 'exit',
});
*/

app.whenReady().then(async () => {
	createWindow();

	// 모델 로드
	const handler = tfjs.io.fileSystem('./files/models/model.json');
	exerciseClassificationModel = await tfjs.loadLayersModel(handler);
});

app.on('window-all-closed', () => {
	app.quit();
});

ipcMain.handle('tfjs-test', async (event, arg) => {
	const tfjsn = require('@tensorflow/tfjs-node');
	const handler = tfjsn.io.fileSystem('./files/models/model.json');
	const model = await tfjsn.loadLayersModel(handler);
	return JSON.stringify(model.toJSON());
});

ipcMain.handle('ping', (event, arg) => {
	const result = arg + ' -> arg_pong';
	return result;
});

let videoPose;
let webcamPose;

ipcMain.on('video-poses', (event, poses) => {
	videoPose = poses.reduce((previous, current) => {
		return previous > current ? previous : current;
	});

	const similarity = compareKeypoints();
	if (similarity != null) {
		event.sender.send('pose-similarity', similarity);
	}

	videoPose = null;
	webcamPose = null;
});

ipcMain.on('webcam-poses', (event, poses) => {
	webcamPose = poses.reduce((previous, current) => {
		return previous > current ? previous : current;
	});
});

function compareKeypoints() {
	if (videoPose != null &&
		webcamPose != null) {
		// 1. get bounding box
		const videoBoundingBox = getBoundingBox(videoPose.keypoints);
		const webcamBoundingBox = getBoundingBox(webcamPose.keypoints);

		// 2. resize keypoints coordinat
		const resizedVideoKeypoints = resizeKeypoints(videoBoundingBox, videoPose.keypoints);
		const resizedWebcamKeypoints = resizeKeypoints(webcamBoundingBox, webcamPose.keypoints);

		// 3. normalize keypoints
		const normalizedVideoKeypoints = normalizeKeypoints(videoBoundingBox, resizedVideoKeypoints);
		const normalizedWebcamKeypoints = normalizeKeypoints(webcamBoundingBox, resizedWebcamKeypoints);

		// 4. keypoints to one dimentonal array
		const videoKeypointsArray = oneDimentionalKeypoints(normalizedVideoKeypoints);
		const webcamKeypointsArray = oneDimentionalKeypoints(normalizedWebcamKeypoints);

		const keypointsSimilarity = similarity(videoKeypointsArray, webcamKeypointsArray);

		return keypointsSimilarity;
	}

	return null;
}

function similarity(A, B) {
	var dotproduct = 0;
	var mA = 0;
	var mB = 0;
	for (let i = 0; i < A.length; i++) { // here you missed the i++
		dotproduct += (A[i] * B[i]);
		mA += (A[i] * A[i]);
		mB += (B[i] * B[i]);
	}
	mA = Math.sqrt(mA);
	mB = Math.sqrt(mB);
	var similarity = (dotproduct) / ((mA) * (mB)); // here you needed extra brackets
	return similarity;
}

function getBoundingBox(keypoints) {
	function reducer({ maxX, maxY, minX, minY }, { position: { x, y } }) {
		return {
			maxX: Math.max(maxX, x),
			maxY: Math.max(maxY, y),
			minX: Math.min(minX, x),
			minY: Math.min(minY, y),
		};
	}

	return keypoints.reduce(
		reducer,
		{
			maxX: Number.NEGATIVE_INFINITY,
			maxY: Number.NEGATIVE_INFINITY,
			minX: Number.POSITIVE_INFINITY,
			minY: Number.POSITIVE_INFINITY,
		}
	);
}


function resizeKeypoints(boundingBox, keypoints) {
	const newKeypoints = keypoints;

	for (let i = 0; i < newKeypoints.length; i++) {
		newKeypoints[i].position.x -= boundingBox.minX;
		newKeypoints[i].position.y -= boundingBox.minY;
	}

	return newKeypoints;
}

function normalizeKeypoints(boundingBox, keypoints) {
	const newKeypoints = keypoints;
	for (let i = 0; i < newKeypoints.length; i++) {
		newKeypoints[i].position.x = l2normalize(newKeypoints[i].position.x,
			boundingBox.maxX, boundingBox.minX);
		newKeypoints[i].position.y = l2normalize(newKeypoints[i].position.y,
			boundingBox.maxY, boundingBox.minY);
	}
	return newKeypoints;
}

function l2normalize(val, max, min) {
	return (val - min) / (max - min);
}

function oneDimentionalKeypoints(keypoints) {
	const oneDimention = [];

	keypoints.forEach( (keypoint) => {
		oneDimention.push(keypoint.position.x);
		oneDimention.push(keypoint.position.y);
	});
	return oneDimention;
}

ipcMain.handle('exercise-classification', async (event, receivedBuffer) => {
	receivedBuffer.shape.unshift(1);
	const receivedTensorBuffer = tfjs.tensor([receivedBuffer.values], receivedBuffer.shape, receivedBuffer.dtype);
	const result = exerciseClassificationModel.predict(receivedTensorBuffer);
	const buffer = result.bufferSync();

	receivedTensorBuffer.dispose();
	result.dispose();

	return buffer;
});
