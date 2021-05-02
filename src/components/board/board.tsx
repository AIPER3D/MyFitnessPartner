import React from 'react';
import styled from 'styled-components';

import Gallery from './gallery';
import List from './list';
import TextList from './textlist';
import Pagination from './pagination';
import { Content } from './content';

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
	
	background-color:#ffffff;
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
			item.push(<Gallery key={ i } content={content[i]}></Gallery>);
		}
	} else if (type == 'list') {
		for (let i = 0; i < content.length; i++) {
			item.push(<List key={ i } content={content[i]}></List>);
		}
	} else {
		for (let i = 0; i < content.length; i++) {
			item.push(<TextList key={ i } content={content[i]}></TextList>);
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
