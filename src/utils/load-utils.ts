const fs = window.require('fs');
import * as tf from '@tensorflow/tfjs';
const path = window.require('path');

import * as tmPose from '@teachablemachine/pose';

export async function loadTMPose(modelPath: string) : Promise<tmPose.CustomPoseNet> {
	const basePath = path.dirname(modelPath);

	const modelData = loadFile(modelPath, 'model.json');
	const weights = loadFile(path.join(basePath, 'weights.bin'), 'weights.bin');
	const metadata = loadFile(path.join(basePath, 'metadata.json'), 'metadata.json');

	const model : tmPose.CustomPoseNet = await tmPose.loadFromFiles(modelData, weights, metadata);

	return model;
}

export async function loadModel(modelPath : string) : Promise<tf.LayersModel> {
	const basePath = path.dirname(modelPath);

	const modelData = loadFile(modelPath, 'model.json');
	const weights = loadFile(path.join(basePath, 'weights.bin'), 'weights.bin');
	const metadata = loadJson(path.join(basePath, 'metadata.json'));

	const model : any = await tf.loadLayersModel(tf.io.browserFiles([modelData, weights]));
	model.metadata = metadata;

	return model;
}

export function loadFile(path : string, fileName : string) {
	const buffer = fs.readFileSync(path);
	const blob = new Blob([buffer]);
	return blobToFile(blob, fileName);
}

export function loadJson(path : string) {
	const buffer = fs.readFileSync(path);
	const text = new TextDecoder().decode(buffer);
	const meta = JSON.parse(text);

	return meta;
}

export function blobToFile(theBlob: Blob, fileName:string): File {
	var b: any = theBlob;
	// A Blob() is almost a File() - it's just missing the two properties below which we will add
	b.lastModifiedDate = new Date();
	b.name = fileName;

	// Cast to a File() type
	return <File>theBlob;
}
