import React from 'react';
import styled from 'styled-components';

type DraggableListProps = {

};

const Group = styled.div`
	padding: 20px 20px 20px 20px;
	margin: 0px 20px 10px 20px;
	
	border: 5px solid #eeeeee;
	overflow: auto;
`;

const Title = styled.div`

`;

function DraggableList() {
	return (
		<div>
			<p>내용</p>
		</div>
	);
}

DraggableList.defaultProps = {

};

export default DraggableList;
