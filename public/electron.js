const { BrowserView, BrowserWindow, app, ipcMain, screen} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const fs = require('fs');
const tf = require('@tensorflow/tfjs');

let win;
let exerciseClassificationModel;

function createWindow() {
	// const {width, height} = screen.getPrimaryDisplay().workAreaSize;

	win = new BrowserWindow({
		backgroundColor: 'white',
		center: true,
		show: false,
		// fullscreen: true,
		webPreferences: {
			nodeIntegration: true,
			nodeIntegrationInWorker: true,
			enableRemoteModule: false,
			worldSafeExecuteJavaScript: true,
			contextIsolation: false,
			devTools: false,
		},
	});

	win.maximize();
	win.show();
	win.focus();

	win.webContents.session.clearCache();

	win.setMenu(null);

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
});

app.on('window-all-closed', () => {
	app.quit();
});

ipcMain.handle('ping', (event, arg) => {
	const result = arg + ' -> arg_pong';
	return result;
});

let videoPose;
let webcamPose;

let sim = 0;

ipcMain.handle('fullscreen', (event, value) => {
	win.setFullScreen(value);
});

ipcMain.on('video-poses', (event, poses) => {
	videoPose = poses.reduce((previous, current) => {
		return previous.score > current.score ? previous : current;
	});

	videoPose.keypoints = videoPose.keypoints.slice(5);

	sim = compareKeypoints();
	event.sender.send('pose-similarity', sim);

	// sim = compareKeypoints2();
	// event.sender.send('pose-similarity', sim);


	videoPose = null;
	webcamPose = null;
});

// ipcMain.on('webcam-poses', (event, poses) => {
// 	webcamPose = poses.reduce((previous, current) => {
// 		return previous > current ? previous : current;
// 	});
// });

ipcMain.on('webcam-poses', (event, pose) => {
	webcamPose = pose;
	webcamPose.keypoints = webcamPose.keypoints.slice(5);
});

// function compareKeypoints2() {
// 	if (videoPose != null &&
// 		webcamPose != null &&
// 		videoPose.keypoints.length === webcamPose.keypoints.length) {
// 		return poseSimilarity(webcamPose, videoPose, { strategy: 'weightedDistance' });
// 	}

// 	return sim;
// }

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
		const [videoKeypointsArray, _] = oneDimentionalKeypoints(normalizedVideoKeypoints);
		const [webcamKeypointsArray, webcamKeypointsScores] = oneDimentionalKeypoints(normalizedWebcamKeypoints);

		const keypointsSimilarity = cosineSimilarity(videoKeypointsArray, webcamKeypointsArray);
		// const keypointsSimilarity = weightedDistanceMatching(
		// 	webcamKeypointsArray,
		// 	videoKeypointsArray,
		// 	webcamKeypointsScores);

		return keypointsSimilarity;
	}

	return lerp(sim, 0, 0.1);
}

function lerp(start, end, amount) {
	return (1-amount)*start+amount*end;
}

function cosineSimilarity(A, B) {
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

function weightedDistanceMatching(vectorPose1XY, vectorPose2XY, vectorConfidences) {
	const summation1 = 1 / vectorConfidences[vectorConfidences.length - 1];
	let summation2 = 0;
	for (let i = 0; i < vectorPose1XY.length; i++) {
		const confIndex = Math.floor(i / 2);
		summation2 += vectorConfidences[confIndex] * Math.abs(vectorPose1XY[i] - vectorPose2XY[i]);
	}

	return summation1 * summation2;
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
	const vectorPose = [];
	const vectorScores = [];

	let vectorScoresSum = 0;

	keypoints.forEach( (keypoint) => {
		vectorPose.push(keypoint.position.x);
		vectorPose.push(keypoint.position.y);

		const score = keypoint.score;
		vectorScores.push(score);
		vectorScoresSum += score;
	});

	vectorScores.push(vectorScoresSum);

	return [vectorPose, vectorScores];
}

ipcMain.handle('exercise-classification', async (event, receivedBuffer) => {
	// 운동 자세 예측
	receivedBuffer.shape.unshift(1);
	const receivedTensorBuffer = tf.tensor([receivedBuffer.values], receivedBuffer.shape, receivedBuffer.dtype);
	const result = exerciseClassificationModel.predict(receivedTensorBuffer);

	console.log(result);

	receivedTensorBuffer.dispose();
	result.dispose();

	// 운동 상태 예측

	return ['big', 'small'];
});
