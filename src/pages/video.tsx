const fs = window.require('fs');
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { RxDatabase } from 'rxdb';
import { VideoDTO } from '../db/DTO';
import { VideoDAO } from '../db/DAO';

import { Header, Button } from '../components/common';
import dummy from '../components/board/images/dummy.jpg';

type BoxProps = {
    width: string;
    color?: string;
    border?: string;
    height?: string;
    display?: string;
}

const Box = styled.div`
    display: ${ (props : BoxProps) => props.display };
	float: left;
    width: calc(${ (props : BoxProps) => props.width });
    min-height: calc(${ (props : BoxProps) => props.height ? props.height : '50px' });
    max-height: calc(300px);
	border: 5px solid ${ (props : BoxProps) => props.color ? props.color : '#eeeeee' };
	overflow: auto;
		
	padding: 10px 15px 10px 15px;
	margin: 10px 0px 20px 20px;
	overflow: auto;
	
	transition: all 1s;
`;

const Title = styled.div`
	width: 920px;
	padding-left: 20px;
	
	margin: 0px;
	
	font-weight: bold;
`;

type TextProps = {
    align?: string;
    float?: string;
    weight?: string;
}

const Text = styled.p`
	float: ${ (props : TextProps) => props.float };
	text-align: ${ (props : TextProps) => props.align };
	font-weight: ${ (props : TextProps) => props.weight };
	
	margin: 0px;
`;

const Input = styled.input`
	border: 0;
	width: 900px;
	height: 21px;
	float: ${ (props : TextProps) => props.float };
	text-align: ${ (props : TextProps) => props.align };
	font-weight: ${ (props : TextProps) => props.weight };
	
	margin: 0px;
	outline: None;
`;

const SubBox = styled.div`
	float: left;
	
	width: calc(100% - 10px);
	height: 30px;
	margin: 5px 5px 5px 5px;
	
	border: 1px solid #dddddd;
	background: #eeeeee;
`;

const SubTitle = styled.div`
	float: left;
	width: calc(100% - 200px);
	height: 20px;
	padding: 4px 0px 5px 15px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 12pt;
	font-weight: bold;
	text-align: left;
`;

type ImageProps = {
    width?: string;
}

const SubImage = styled.img`
    text-align: center;
	width: ${ (props : ImageProps) => props.width };
	
	margin: auto 0px auto 0px;
`;

const SubText = styled.p`
	float: left;
	width: calc(150px);
	height: 20px;
	padding: 5px 0px 0px 15px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 10pt;
	text-align: right;
	overflow-y: auto;
`;

type PageProps = {
    db: RxDatabase;
};

interface Param {
    id: string;
}

function Video({ db } : PageProps) {
	const { id } = useParams<Param>();

	const videoDTO = new VideoDTO();
	const [video, setVideo] = useState<VideoDAO | null>(null);
	const [name, setName] = useState<string>('');
	const [thumbnail, setThumbnail] = useState<string>(dummy);

	useEffect(() => {
		videoDTO.setDB(db);
		load();
	}, [db]);

	async function load() {
		const vd: VideoDAO | null = await videoDTO.getVideoById(Number(id));
		setVideo(vd);

		if (vd != null) {
			setName(vd.name);

			if (fs.existsSync('./files/thumbnails/' + vd['id'] + '.im')) {
				const source = fs.readFileSync('./files/thumbnails/' + vd['id'] + '.im');
				const thumb = new TextDecoder().decode(source);

				setThumbnail(thumb);
			}
		}
	}

	function onChangeName(e : any) {
		setName(e.target.value);
	}

	if (video == null) {
		return (
			<div>
				<Header text='영상 정보' />
			</div>
		);
	} else {
		return (
			<div>
				<Header text='영상 정보' />
				<Title>영상 명</Title>
				<Box width={ '920px' } height={ '23px' } color={ name != video.name ? '#48ACF0' : '#eeeeee' }>
					<Input weight={'bold'} float={'left'} value={ name } onChange={ onChangeName } />
				</Box>
				<Title>영상 정보</Title>
				<Box width = { '430px' } height={ '300px' } display={'flex'}>
					<SubImage src={ thumbnail } width= { '430px' } />
				</Box>
				<Box width = { '430px' } height= { '300px' }>
					<SubBox>
						<SubTitle>운동 명</SubTitle>
						<SubText>00:00 - 00:00</SubText>
					</SubBox>
					<SubBox>
						<SubTitle>운동 명</SubTitle>
						<SubText>00:00 - 00:00</SubText>
					</SubBox>
					<SubBox>
						<SubTitle>운동 명</SubTitle>
						<SubText>00:00 - 00:00</SubText>
					</SubBox>
					<SubBox>
						<SubTitle>운동 명</SubTitle>
						<SubText>00:00 - 00:00</SubText>
					</SubBox>
					<SubBox>
						<SubTitle>운동 명</SubTitle>
						<SubText>00:00 - 00:00</SubText>
					</SubBox>
					<SubBox>
						<SubTitle>운동 명</SubTitle>
						<SubText>00:00 - 00:00</SubText>
					</SubBox>
					<SubBox>
						<SubTitle>운동 명</SubTitle>
						<SubText>00:00 - 00:00</SubText>
					</SubBox>
					<SubBox>
						<SubTitle>운동 명</SubTitle>
						<SubText>00:00 - 00:00</SubText>
					</SubBox>
				</Box>
				<Button href={ '/videos/1' } text = { '확인' } />
			</div>
		);
	}
}

export default Video;
