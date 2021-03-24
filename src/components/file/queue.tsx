import React from 'react';
import styled from 'styled-components';

import Data from './data';

type QueueProps = {
    queue: File[];
};


const Group = styled.div`
	padding: 20px 20px 20px 20px;
	margin: 0px 20px 10px 20px;
	
	border: 5px solid #eeeeee;
	overflow: auto;
`;

const Title = styled.div`

`;

function Queue({ queue } : QueueProps) {
	const arr = [];
	console.log(queue);
	for (let i = 0; i < queue.length; i++) {
		arr.push(<Data key={ queue[i].size } data={ queue[i] } />);
	}

	return (
		<div>
			<p> { queue.length } 개 등록중</p>
			<Group>
				{ arr }
			</Group>
		</div>
	);
}

Queue.defaultProps = {

};

export default Queue;
