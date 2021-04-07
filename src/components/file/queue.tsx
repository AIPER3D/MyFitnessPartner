import React, {useState} from 'react';
import styled from 'styled-components';
import { RxDatabase } from 'rxdb';

import { Item, Data } from './';

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
	const arr = [];
	for (let i = 0; i < data.length; i++) {
		arr.push(
			<Item db= { db } data={ data[i] } key={ i } />
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
