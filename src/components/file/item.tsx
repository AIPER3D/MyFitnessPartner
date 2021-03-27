import React, {useState} from 'react';
import styled from 'styled-components';

import { Data } from './data';

type ItemProps = {
    data: Data;
};

const Root = styled.div`
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

const Thumbnail = styled.img`
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


function Item({ data } : ItemProps) {
	const [thumb, setThumb] = useState<string>('');
	const [current, setCurrent] = useState<number>(0);
	const [total, setTotal] = useState<number>(0);

	data.reader.onload = (e) => {
		if (e.target == null || e.target.result == null) return;
		const blob = new Blob([e.target.result], {type: data.file.type});
		const url = URL.createObjectURL(blob);

		console.log(blob);
		console.log(url);
	};

	data.reader.onprogress = (e) => {
		if (e.lengthComputable) {
			setCurrent(e.loaded);
			setTotal(e.total);
		}
	};

	return (
		<Root>
			<Thumbnail src={ thumb }/>
			<Title> { data.file.name } </Title>
			<Text> { current + '/' + total } </Text>
		</Root>
	);
}

Item.defaultProps = {

};

export default Item;
