import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';

const COLOR = 'aqua';
const BOUNDING_BOX_COLOR = 'red';
const LINE_WIDTH = 2;

export function getCount(array : any) {
	return array.reduce((previousValue : any, currentValue : any) => {
		previousValue[currentValue] = (previousValue[currentValue] || 0) + 1;
		return previousValue;
	}, {});
}

// get square box position
export function getSquareBound(width : number, height : number) {
	const posCenter = [width / 2, height / 2];
	const posSize = (width > height ? height : width) / 2;
	const posBox = [posCenter[1]-posSize, posCenter[0]-posSize, posCenter[1]+posSize, posCenter[0]+posSize];
	const posNormalized = [
		posBox[0]/height,
		posBox[1]/width,
		posBox[2]/height,
		posBox[3]/width,
	];

	return posNormalized;
}

export function drawKeypoints(graphics: any, keypoints: any, minConfidence: number) {
	for (let i = 0; i < keypoints.length; i++) {
		const keypoint = keypoints[i];

		if (keypoint.score < minConfidence) {
			continue;
		}

		const { x, y } = keypoint.position;

		drawPoint(graphics, x, y, 5, 0xffffff);
	}
}

// export function drawKeypoints(ctx: any, keypoints: any, minConfidence: number) {
// 	for (let i = 0; i < keypoints.length; i++) {
// 		const keypoint = keypoints[i];

// 		if (keypoint.score < minConfidence) {
// 			continue;
// 		}

// 		const { x, y } = keypoint.position;

// 		drawPoint(ctx, x, y, 5, 'white');
// 	}
// }

export function drawPoint(graphics: any, x: number, y: number, raidus: number, color: number) {
	graphics.beginFill(color);
	graphics.drawCircle(x, y, raidus);
	graphics.endFill();
}

// export function drawPoint(ctx: any, x: number, y: number, raidus: number, color: string) {
// 	ctx.beginPath();
// 	ctx.fillStyle = color;
// 	ctx.arc(x, y, raidus, 0, 2 * Math.PI);
// 	ctx.fill();
// }

export function drawLine(graphics: any, [ax, ay]: [number, number],
	[bx, by]: [number, number], thickness: number, color: number) {
	graphics.beginFill();
	graphics.lineStyle(thickness, color);
	graphics.moveTo(ax, ay);
	graphics.lineTo(bx, by);
	graphics.endFill();
}

// export function drawLine(ctx: any, [ax, ay]: [number, number],
// 	[bx, by]: [number, number], thickness: number, color: string) {
// 	ctx.beginPath();
// 	ctx.strokeStyle = color;
// 	ctx.lineWidth = thickness;
// 	ctx.moveTo(ax, ay);
// 	ctx.lineTo(bx, by);
// 	ctx.stroke();
// }

export function drawSkeleton(graphics: any, keypoints: any, minConfidence: number,) {
	const skeleton = posenet.getAdjacentKeyPoints(keypoints, minConfidence);

	function toTuple({ y, x }: { y: any, x: any }) {
		return [y, x];
	}

	skeleton.forEach((keypoints) => {
		const ax = keypoints[0].position.x;
		const ay = keypoints[0].position.y;

		const bx = keypoints[1].position.x;
		const by = keypoints[1].position.y;

		drawLine(
			graphics, [ax, ay], [bx, by], 2, 0xffffff
		);
	});
}

// export function drawSkeleton(ctx: any, keypoints: any, minConfidence: number,) {
// 	const skeleton = posenet.getAdjacentKeyPoints(keypoints, minConfidence);

// 	function toTuple({ y, x }: { y: any, x: any }) {
// 		return [y, x];
// 	}

// 	skeleton.forEach((keypoints) => {
// 		const ax = keypoints[0].position.x;
// 		const ay = keypoints[0].position.y;

// 		const bx = keypoints[1].position.x;
// 		const by = keypoints[1].position.y;

// 		drawLine(
// 			ctx, [ax, ay], [bx, by], 2, 'white'
// 		);
// 	});
// }

/*
 * Draw the bounding box of a pose. For example, for a whole person standing
 * in an image, the bounding box will begin at the nose and extend to one of
 * ankles
 */

export function drawBoundingBox(graphics : any, keypoints : any) {
	const boundingBox = posenet.getBoundingBox(keypoints);

	// ctx.rect(
	// 	boundingBox.minX, boundingBox.minY, boundingBox.maxX - boundingBox.minX,
	// 	boundingBox.maxY - boundingBox.minY);

	// ctx.strokeStyle = BOUNDING_BOX_COLOR;
	// ctx.stroke();
}

/*
 * Draw an image on a canvas
 */
// export function renderImageToCanvas(image, size, canvas) {
// 	canvas.width = size[0];
// 	canvas.height = size[1];
// 	const ctx = canvas.getContext('2d');

// 	ctx.drawImage(image, 0, 0);
// }

/*
 * Draw heatmap values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's heatmap outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
// export function drawHeatMapValues(heatMapValues, outputStride, canvas) {
// 	const ctx = canvas.getContext('2d');
// 	const radius = 5;
// 	const scaledValues = heatMapValues.mul(tf.scalar(outputStride, 'int32'));

// 	drawPoints(ctx, scaledValues, radius, COLOR);
// }

/*
 * Used by the drawHeatMapValues method to draw heatmap points on to
 * the canvas
 */


/*
 * Draw offset vector values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's offset vector outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
// export function drawOffsetVectors(
// 	heatMapValues, offsets, outputStride, scale = 1, ctx) {
// 	const offsetPoints =
// 		posenet.singlePose.getOffsetPoints(heatMapValues, outputStride, offsets);

// 	const heatmapData = heatMapValues.buffer().values;
// 	const offsetPointsData = offsetPoints.buffer().values;

// 	for (let i = 0; i < heatmapData.length; i += 2) {
// 		const heatmapY = heatmapData[i] * outputStride;
// 		const heatmapX = heatmapData[i + 1] * outputStride;
// 		const offsetPointY = offsetPointsData[i];
// 		const offsetPointX = offsetPointsData[i + 1];

// 		drawSegment(
// 			[heatmapY, heatmapX], [offsetPointY, offsetPointX], COLOR, scale, ctx);
// 	}
// }
