import React, {useState} from 'react';
import styled from 'styled-components';
import { RxDatabase } from 'rxdb';

import { Item, Data } from './';
import { useEffect } from 'react';
import { loadModel, loadTMPose } from '../../utils/load-utils';
import * as tf from '@tensorflow/tfjs';
import { CustomPoseNet } from '@teachablemachine/pose';
import { tensorToImage } from '../../utils/video-util';


type QueueProps = {
	db: RxDatabase;
	data: Data[];
};

const Group = styled.div`
	padding: 10px 10px 10px 10px;
	margin: 0px 20px 10px 20px;
	
	border: 5px solid #eeeeee;
	overflow: auto;
`;

const Block = styled.div`
	margin: 12px 5px 3px 5px;
	padding: 0px;
	overflow: auto;
`;

const Title = styled.p`
	float: left;
	padding: 0px 0px 0px 20px;
	margin: 0px;
	
	font-weight: bold;
`;

const Count = styled.p`
	float: right;
	padding: 5px 20px 0px 0px;
	margin: 0px;
	
	font-size: 10pt;
`;

function Queue({ db, data } : QueueProps) {
	// const [exerciseModel, setExerciseModel] = useState<tf.LayersModel>();
	const [exerciseModel, setExerciseModel] = useState<CustomPoseNet>();

	useEffect(() => {
		(async () => {
			// setExerciseModel(await loadModel('files/models/exercise_classifier/tm-my-image-model/model.json'));
			setExerciseModel(await loadTMPose('files/models/poseClassification-posenet-epoch10/model.json'));
		})();
	}, []);


	async function predict(tensorImage : any) : Promise<string> {
		if (exerciseModel != undefined && exerciseModel != null) {
			const image = tensorToImage(tensorImage);

			const {pose, posenetOutput} = await exerciseModel.estimatePose(image);

			// 운동 자세 예측
			// const exerciseTensor = exerciseModel.predict(posenetOutput) as tf.Tensor<tf.Rank>;
			// const exerciseArray = (exerciseTensor.arraySync() as number[][])[0];
			// const exerciseMax = Math.max(...exerciseArray);
			// const exerciseIndex = exerciseArray.indexOf(exerciseMax);
			// const exerciseResult = (exerciseModel as any).metadata.labels[exerciseIndex];

			const exerciseTensor = await exerciseModel.predict(posenetOutput);

			// 최대값
			var maxClass = exerciseTensor.reduce( function(previous, current) {
				return previous.probability > current.probability ? previous:current;
			});

			// exerciseTensor.dispose();
			return maxClass.className;
		}

		// 비정상적 조건일때
		return '';
	}

	const arr = [];
	for (let i = 0; i < data.length; i++) {
		arr.push(
			<Item key = { i } db= { db } data={ data[i] } onPredict={ predict } />
		);
	}

	return (
		<div>
			<Block>
				<Title> 등록 상태 </Title>
				<Count> { data.length } 개</Count>
			</Block>
			<Group>
				{ arr }
			</Group>
		</div>
	);
}

Queue.defaultProps = {

};

export default Queue;
