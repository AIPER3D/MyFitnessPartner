import React from 'react';
import styled from 'styled-components';

import Gallery from './gallery';
import List from './list';
import Pagination from './pagination';
import { Content } from './content';

import { Header } from '../common';

type BoardProps = {
	type: string;
    content: Content[];
};

const Box = styled.div`
	padding: 10px 10px 10px 10px;
	margin: 10px 10px 1px 10px;
	
	overflow: auto; 
`;

function Board({ type, content }: BoardProps) {
	const item = [];

	if (type == 'gallery') {
		for (let i = 0; i < content.length; i++) {
			item.push(<Gallery content={content[i]}></Gallery>);
		}
	} else {
		for (let i = 0; i < content.length; i++) {
			item.push(<List content={content[i]}></List>);
		}
	}

	return (
		<div>
			<Box> {item} </Box>
			<Pagination count={ 0 }></Pagination>
		</div>
	);
}

Board.defaultProps = {

};

export default Board;
