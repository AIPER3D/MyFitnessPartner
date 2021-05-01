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
    currentPage: number;
    maxPage: number;
};

const Root = styled.div`
	overflow: hidden;
`;

const Box = styled.div`
	display: block;
	border: 5px solid #eeeeee;
	padding: 20px 20px 20px 20px;
	margin: 20px 20px 10px 20px;
	
	font-size: 12pt;
	text-align: center;
	overflow: hidden;
`;

const Item = styled.div`
	padding: 0px 0px 0px 0px;
	margin: 0px 0px 0px 0px;
	
	overflow: hidden; 
`;

function Board({ type, content, currentPage, maxPage }: BoardProps) {
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
		<Root>
			<Box>
				<Item> {item} </Item>
			</Box>
			<Pagination current={ currentPage } max={ maxPage }></Pagination>
		</Root>

	);
}

Board.defaultProps = {

};

export default Board;
