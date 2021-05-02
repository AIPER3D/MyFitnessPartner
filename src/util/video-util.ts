import * as tf from '@tensorflow/tfjs';

const canvas : HTMLCanvasElement = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const imageFromVideo = (video : HTMLVideoElement) => {
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;

	ctx?.drawImage(
		video,
		0,
		0,
		canvas.width,
		canvas.height
	);

	const image = ctx?.getImageData(
		0,
		0,
		canvas.width,
		canvas.height);

	return image;
};

const iamgeDataToTensor = (image : any) : tf.Tensor => {
	return tf.browser.fromPixels(image);
};

const resizeImage = (
	image : any,
	options : {
		width : number,
		height : number,
}) : tf.Tensor3D|tf.Tensor4D => {
	return tf.image.resizeNearestNeighbor(image, [options.height, options.width]);
};

export {imageFromVideo, resizeImage, iamgeDataToTensor};
