import React from 'react';
import styled from 'styled-components';
import dummy from '../board/images/dummy.jpg';

type DataProps = {
    data: File;
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


function Data({ data } : DataProps) {
	console.log('new');
	const reader = new FileReader();

	reader.onload = (progressEvent) => {
		if (progressEvent.target == null) return;
		console.log('OK');
	};

	reader.onprogress = (data) => {
		if (data.lengthComputable) {
			// eslint-disable-next-line max-len
			console.log((data.loaded + '/' + data.total));
		}
	};

	reader.readAsBinaryString(data);

	return (
		<Box>
			<Image></Image>
			<Title> { data.name } </Title>
			<Text> { data.size } </Text>
		</Box>
	);
}

Data.defaultProps = {

};

export default Data;
