const { Tensor, InferenceSession } = require('onnxjs');
const tf = require('@tensorflow/tfjs');

tf.tensor3d(
	[1, 2, 3, 4, 5, 6, 7, 8, 9,
		1, 2, 3, 4, 5, 6, 7, 8, 9,
		1, 2, 3, 4, 5, 6, 7, 8, 9],

	[1, 3, 9], 'float32').print();
