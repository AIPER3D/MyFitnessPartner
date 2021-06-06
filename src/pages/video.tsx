const path = require('path');
import {loadFile, loadJson} from '../utils/load-utils';

const fs = window.require('fs');
import React, { useEffect, useState } from 'react';
import {Redirect, useParams} from 'react-router-dom';
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
	
	width: calc(100%);
	height: 30px;
	margin: 5px 5px 5px 5px;
	
	background: #ffffff;
`;

const SubTitle = styled.select`
	float: left;
	width: calc(100% - 10px);
	height: 30px;
	padding: 4px 0px 5px 15px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 12pt;
	font-weight: bold;
	text-align: left;
	
	transition: 0.5s all;
	border: 1px solid #cccccc;
	
	outline: none;
	appearance: none;
	
	&:focus {
		transition: 0.5s all;
		border: 1px solid #000000;
	}
	
	&:after {
		transition: 0.5s all;
		border: 1px solid #cccccc;
	}
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
	position: absolute;
	float: right;
	width: calc(150px - 10px);
	height: 20px;
	padding: 5px 15px 0px 15px;
	margin: 0px 0px 0px 250px;
	
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
	const [updated, setUpdated] = useState<number>(0);

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
		setUpdated(updated + 1);
	}
	function digit(n : number) : string {
		if (n >= 10) return '' + n;
		else return '0' + n;
	}
	function getTime(time : number) : string {
		if (isNaN(time)) return '00:00';

		const h = Math.floor(time / 3600);
		time = time % 3600;

		const m = Math.floor(time / 60);
		time = time % 60;

		const s = Math.floor(time);

		return digit(h) + ':' + digit(m) + ':' + digit(s);
	}
	async function onChangeOption(e : any) {
		if (video == null) return;

		video['timeline'][e.target.id]['name'] = e.target.value;
		setUpdated(updated + 1);
	}
	async function submit(e : any) {
		e.preventDefault();

		if (updated == 0) {
			setUpdated(-1);
			return;
		}

		if (video == null) return;

		video['name'] = name;

		videoDTO.setDB(db);
		const result = await videoDTO.updateVideo(video);
		if (result == true) {
			alert(`수정 완료`);
		} else {
			alert('수정 실패');
		}
		setUpdated(0);
	}

	if (video == null) {
		return (
			<div>
				<Header text='영상 정보' />
			</div>
		);
	} else {
		const metadata = loadJson('files/models/teachable-machine/poseClassification-posenet-epoch10/metadata.json');
		const options = [];
		for (let i = 0; i < metadata['labels'].length; i++) {
			options.push(<option key={ i } value={ metadata['labels'][i] }> { metadata['labels'][i] } </option>);
		}

		const arr = [];
		for (let i = 0; i < video.timeline.length; i++) {
			arr.push(
				<SubBox key={ i }>
					<SubTitle id={ i.toString() } value={video['timeline'][i]['name']} onChange={ onChangeOption }>
						{ options }
					</SubTitle>
					<SubText>{getTime(video['timeline'][i]['start'])} - {getTime(video['timeline'][i]['end'])}</SubText>
				</SubBox>
			);
		}

		if (updated == -1) {
			return (<Redirect to={ '/videos/1' } />);
		}

		return (
			<form onSubmit={ submit } >
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
					{ arr }
				</Box>

				<Button text={ updated > 0 ? '수정하기' : '돌아가기' } color={ updated > 0 ? 'blue' : 'dark'}/>
			</form>
		);
	}
}

export default Video;
