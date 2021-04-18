// const onnx = require('onnxjs');
// const ndarray = require('ndarray');
// const ops = require('ndarray-ops');
// const np = require('numpy-matrix-js');
// const cv = require('opencv4nodejs');

// const image = cv.imread('./public/images/test.png');
// cv.imshowWait('Image', image);
// class Toy {
// 	private aa :number;
//     private AVG_PERSON_HEIGHT : number;
// 	private mapIdToPanoptic :
// 		number[] ;
// 	private limbs :
// 		Array<number[]>;
// 	private previousPoses2d : any[] = [];

// 	constructor() 
// 	{
// 		this.aa = 1;
// 		this.AVG_PERSON_HEIGHT = 100;
// 		this.mapIdToPanoptic = [1, 0, 9, 10, 11, 3, 4, 5, 12, 13, 14, 6, 7, 8, 15, 16, 17, 18];
// 		this.limbs = [
// 			[18, 17, 1],
// 			[16, 15, 1],
// 			[5, 4, 3],
// 			[8, 7, 6],
// 			[11, 10, 9],
// 			[14, 13, 12]];
// 	}


// 	// function extract_poses(heatmaps:any,pafs:any,upsample_ratio:number): any
// 	// {
// 	//     heatmaps = np.transpose(heatmaps,[1,2,0]); // 기존에서는 (1,2,0) 으로 해야되는대 계속 빨간중 떠서 일단 괄호를 바꿈 아마 문제있을듯 
// 	// 	pafs = np.transpose(pafs,[1,2,0]); 

// 	// }


// 	// function get_root_relative_poses(features:any[][],heatmaps:any[][],pafs:any[][]) : any
// 	// {
// 	//     var upsample_ratio = 4;

// 	// }
// }

// function preprocess(data:any, width:number, height:number) : any {
// 	const dataFromImage = ndarray(new Float32Array(data), [width, height, 4]);
// 	const dataProcessed = ndarray(new Float32Array(width * height * 3), [1, 3, height, width]);

// 	// Normalize 0-255 to (-1)-1
// 	ops.divseq(dataFromImage, 128.0);
// 	ops.subseq(dataFromImage, 1.0);

// 	// Realign imageData from [224*224*4] to the correct dimension [1*3*224*224].
// 	ops.assign(dataProcessed.pick(0, 0, null, null), dataFromImage.pick(null, null, 2));
// 	ops.assign(dataProcessed.pick(0, 1, null, null), dataFromImage.pick(null, null, 1));
// 	ops.assign(dataProcessed.pick(0, 2, null, null), dataFromImage.pick(null, null, 0));

// 	return dataProcessed.data;
// }

// async function loadOnnx():Promise<any> {
// 	const session = new onnx.InferenceSession();
// 	const url = './src/models/human-pose-estimation-3d.onnx';
// 	await session.loadModel(url);

// 	const imageLoader = new Image();
// 	imageLoader.src = image;

// 	const wid = imageLoader.width;
// 	const hei = imageLoader.height;

// 	const preprocessedData = preprocess(imageLoader, wid, hei);
// 	const inputTensor = new onnx.Tensor(preprocessedData, 'float32', [1, 3, wid, hei]);
// 	const outputMap = await session.run([inputTensor]);
// 	const outputData = outputMap.values().next().value.data;
// 	const x = outputData.toString();
// 	console.log(x);
// }

// export { Toy, preprocess, loadOnnx };

