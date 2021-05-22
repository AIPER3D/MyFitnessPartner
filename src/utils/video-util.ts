import * as tf from '@tensorflow/tfjs';

const canvas : HTMLCanvasElement = document.createElement('canvas');
const ctx = canvas.getContext('2d');

export function tensorToImage(tensor : tf.Tensor3D | tf.Tensor4D) {
	const [height, width, channel] = tensor.shape.length >= 4 ? tensor.shape.slice(1) : tensor.shape;

	// create a buffer array
	const buffer = new Uint8ClampedArray(width * height * 4);
	// create an Image data var
	const imageData = new ImageData(width, height);
	// get the tensor values as data
	const data = tensor.dataSync();
	// map the values to the buffer

	var i = 0;
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			var pos = (y * width + x) * 4; // position in buffer based on x and y
			buffer[pos] = data[i]; // some R value [0, 255]
			buffer[pos+1] = data[i+1]; // some G value
			buffer[pos+2] = data[i+2]; // some B value
			buffer[pos+3] = 255; // set alpha channel
			i+=3;
		}
	}
	// set the buffer to the image data
	imageData.data.set(buffer);

	return imageData;
}

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
