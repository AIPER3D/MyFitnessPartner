import React from 'react';
import styled from 'styled-components';

import { Content } from './content';
import dummy from './images/dummy.jpg';

type GalleryProps = {
	content: Content;
};

const Box = styled.div`
	float: left;
	
	width: 300px;
	height: 255px;
	margin: 25px 5px 5px 5px;
	
	border: 1px solid #dddddd;
	background: #eeeeee;
	
	&:hover {
		transform: scale(1.025);
		transition: transform 0.1s;
		//filter: brightness(70%);
		cursor: pointer;
	}
	
`;

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

const Image = styled.img`
	width: 300px;
	height: 200px;
	
	border-bottom: 1px solid #dddddd;
	object-fit: cover;
`;

const Title = styled.div`
	display: block;
	width: 290px;
	height: 20px;
	padding: 3px 0px 0px 10px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 10pt;
	font-weight: bold;
	text-align: left;
`;

const Text = styled.div`
	display: block;
	width: 290px;
	height: 20px;
	padding: 2px 0px 0px 10px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 9pt;
	text-align: left;
`;

function Gallery({ content }: GalleryProps) {
	console.log(dummy);
	return (
		<Box>
			<Alert> 1일차 </Alert>
			<Image src={ dummy }/>
			<Title> { content.title } </Title>
			<Text> 1일차 진행중입니다. </Text>
		</Box>
	);
}

Gallery.defaultProps = {

};

export default Gallery;
