import React, {useState} from 'react';
import styled from 'styled-components';

import { Item, Data } from './';

type QueueProps = {
	data: Data[];
};

const Group = styled.div`
	padding: 20px 20px 20px 20px;
	margin: 0px 20px 10px 20px;
	
	border: 5px solid #eeeeee;
	overflow: auto;
`;

function Queue({ data } : QueueProps) {
	const arr = [];
	for (let i = 0; i < data.length; i++) {
		arr.push(
			<Item data={ data[i] } key={ i } />
		);
	}

	return (
		<div>
			<p> { data.length } 개 등록중</p>
			<Group>
				{ arr }
			</Group>
		</div>
	);
}

Queue.defaultProps = {

};

export default Queue;
