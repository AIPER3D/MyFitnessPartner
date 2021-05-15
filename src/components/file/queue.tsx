import React, {useState} from 'react';
import styled from 'styled-components';
import { RxDatabase } from 'rxdb';

import { Item, Data } from './';
import { useEffect } from 'react';
import { loadModel } from '../../utils/load-utils';
import * as tf from '@tensorflow/tfjs';


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
	const [exerciseModel, setExerciseModel] = useState<tf.LayersModel>();

	useEffect(() => {
		(async () => {
			setExerciseModel(await loadModel('./files/models/exercise_classifier/PoseClassification/model.json'));
		})();
	}, []);


	function predict(tensorImage : any) : [string, string] {
		if (exerciseModel != undefined && exerciseModel != null) {
			tensorImage = tensorImage.expandDims();

			console.log(tensorImage);

			// 운동 자세 예측
			const resultTensor = exerciseModel.predict(tensorImage) as tf.Tensor<tf.Rank>;
			const resultArray = resultTensor.arraySync() as number[];
			const maxValue = Math.max.apply(null, resultArray);
			const maxIndex = resultArray.indexOf(maxValue);
			// console.log(exerciseModel['metadata'].labels[maxIndex]);

			resultTensor.dispose();
		}

		// 비정상적 조건일때
		return ['', ''];
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
