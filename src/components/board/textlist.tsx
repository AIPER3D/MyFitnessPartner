import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Content } from './content';
import dummy from './images/dummy.jpg';

type ListProps = {
    content: Content;
};

const Box = styled.div`
	float: left;
	
	width: calc(100% - 10px);
	height: 50px;
	margin: 10px 5px 0px 5px;
	
	border: 1px solid #dddddd;
	background: #eeeeee;
	
	&:hover {
		transform: scale(1.025);
		transition: transform 0.1s;
		//filter: brightness(70%);
		cursor: pointer;
	}
`;

const Title = styled.div`
	float: left;
	width: calc(100% - 200px);
	height: 20px;
	padding: 14px 0px 5px 15px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 12pt;
	font-weight: bold;
	text-align: left;
`;

const Text = styled.p`
	float: left;
	width: calc(150px);
	height: 20px;
	padding: 16px 0px 0px 15px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 10pt;
	text-align: right;
	overflow-y: auto;
`;

function TextList({ content }: ListProps) {
	return (
		<Box onClick = { () => {
			if (content.onClick) {
				content.onClick(content.id);
			}
		}}>
			<Title> { content.title } </Title>
			<Text> { content.desc ? content.desc : '' }</Text>
		</Box>
	);
}

TextList.defaultProps = {

};

export default TextList;
