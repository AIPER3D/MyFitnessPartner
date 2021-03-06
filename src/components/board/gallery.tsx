const fs = window.require('fs');
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Content } from './content';
import dummy from './images/dummy.jpg';

type GalleryProps = {
	content: Content;
};

const Box = styled.div`
	float: left;
	
	width: 288px;
	height: 255px;
	margin: 5px 5px 5px 6px;
	
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
	width: 256px;
	height: 20px;
	padding: 0px 5px 0px 0px;
	margin: -20px 0px 0px 0px;
	
	color: #000000;
	font-size: 9pt;
	text-align: right;
`;

const Image = styled.img`
	width: 288px;
	height: 162px;
	
	background-color: #000000;
	border-bottom: 1px solid #dddddd;
	object-fit: contain;
`;

const Title = styled.div`
	display: block;
	width: 270px;
	height: 20px;
	padding: 3px 0px 0px 10px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 10pt;
	font-weight: bold;
	text-align: left;
	
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; 
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
	const [thumbnail, setThumbnail] = useState<string>(dummy);

	useEffect(() => {
		if (!content.thumbnail) return;
		if (!fs.existsSync(content.thumbnail)) return;

		const source = fs.readFileSync(content['thumbnail']);
		const thumb = new TextDecoder().decode(source);

		setThumbnail(thumb);
	}, [content.thumbnail]);

	return (
		<Box onClick = { () => {
			if (content.onClick) {
				content.onClick(content.id);
			}
		}}>
			<Image src={ thumbnail }/>
			<Title> { content.title } </Title>
			<Text> { content.desc } </Text>
		</Box>
	);
}

Gallery.defaultProps = {

};

export default Gallery;
