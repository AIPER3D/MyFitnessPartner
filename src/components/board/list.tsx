import React from 'react';
import styled from 'styled-components';

import { Content } from './content';
import dummy from './images/dummy.jpg';

type ListProps = {
	content: Content;
};

const Box = styled.div`
	float: left;
	
	width: calc(100% - 10px);
	height: 100px;
	margin: 10px 5px 0px 5px;
	
	border: 1px solid #dddddd;
	background: #eeeeee;
	
	&:hover {
		cursor: pointer;
	}
	
`;

/*
const Alert = styled.div`
	position: relative;
	display: block;
	width: 300px;
	height: 20px;
	padding: 0px 5px 0px 0px;
	margin: -20px 0px 0px 0px;

	color: #000000;
	font-size: 9pt;
	text-align: right;
`;
*/

const Image = styled.img`
	float: left;
	width: 150px;
	height: 100px;
	
	object-fit: cover;
`;

const Title = styled.div`
	float: left;
	width: calc(100% - 200px);
	height: 20px;
	padding: 10px 0px 10px 15px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 12pt;
	font-weight: bold;
	text-align: left;
`;

const Text = styled.p`
	float: left;
	width: calc(100% - 180px);
	height: calc(100% - 45px);
	padding: 5px 0px 0px 15px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 10pt;
	text-align: left;
	overflow-y: scroll;
`;

function List({ content }: ListProps) {
	return (
		<Box>
			<Image src={ content.thumbnail ? content.thumbnail : dummy }></Image>
			<Title> { content.title } </Title>
			<Text> { content.desc ? content.desc : '' }</Text>
		</Box>
	);
}

List.defaultProps = {

};

export default List;
