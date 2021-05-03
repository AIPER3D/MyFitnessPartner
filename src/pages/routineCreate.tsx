import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Redirect } from 'react-router-dom';
import { GroupOptions, ReactSortable } from 'react-sortablejs';

import { RxDatabase } from 'rxdb';
import { VideoDTO, RoutineDTO } from '../db/DTO';
import { VideoDAO, RoutineDAO } from '../db/DAO';

import { Header, Button } from '../components/common';

const Root = styled.form`
	overflow: auto;
`;

const Box = css`
	float: left;
	width: 440px;

	border: 5px solid #eeeeee;
	overflow: auto;
`;

const RoutineName = styled.input`
	${ Box }
	width: 930px;
	height: 30px;
	padding: 5px 5px 5px 15px;
	margin: 5px 20px 15px 20px;
`;

const ColumnTitle = styled.div`
	width: 920px;
	padding-left: 20px;
	
	font-weight: bold;
`;

const Title = styled.div`
	${ Box }
	padding: 5px 5px 5px 5px;
	margin: 5px 20px 0px 20px;
	
	font-weight: bold;
	text-align: center;
`;

const List = styled.div`
	${ Box }
	height: 500px;
	padding: 5px 5px 5px 5px;
	margin: 10px 20px 20px 20px;
	overflow: auto;
	
	& > div {
		height: 99%;
	}
`;

const Item = styled.div`
	padding: 5px 5px 5px 5px;
	margin: 5px 5px 5px 5px;
	
	border: 2px solid #eeeeee;
	overflow: auto;
`;

const Thumbnail = styled.img`
	float: left;
	width: 60px;
	height: 40px;
	
	object-fit: cover;
`;

const Name = styled.div`
	float: left;
	width: 250px;
	padding: 10px 10px 0px 10px;
	margin: 0px 0px 0px 0px;
	
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	
	color: #000000;
	font-size: 10pt;
	font-weight: bold;
	text-align: left;
`;

const Right = css`
	float: right;
	padding: 10px 10px 0px 10px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 9pt;
	text-align: left;
	overflow-y: hidden;
`;

const Text = styled.p`
	${ Right }
`;

const Delete = styled.p`
	${ Right }
	
	cursor: pointer;
`;

type PageProps = {
	db: RxDatabase;
};

type Video = {
	id : number;
	name: string;
	thumbnail: string;
}

function RoutineCreate(this: any, { db } : PageProps) {
	const [title, setTitle] = useState<string>('새 루틴');
	const [videoDTO] = useState<VideoDTO>(new VideoDTO());
	const [routineDTO] = useState<RoutineDTO>(new RoutineDTO());
	const [video, setVideo] = useState<Video[]>([]);
	const [selected, setSelected] = useState<Video[]>([]);
	const [redirect, setRedirect] = useState<boolean>(false);

	useEffect(() => {
		routineDTO.setDB(db);
		videoDTO.setDB(db);

		select();
	}, [db]);

	async function select() {
		const v : VideoDAO[] = await videoDTO.getAllVideosAsArray();
		const arr : Video[] = [];

		for (let i = 0; i < v.length; i++) {
			const path = './files/thumbnails/' + v[i]['id'] + '.im';
			let thumb = '';
			if (window.api.fs.existsSync(path)) {
				const source = window.api.fs.readFileSync(path);
				thumb = new TextDecoder().decode(source);
			} else {
				thumb = '';
			}

			arr.push({
				id: v[i]['id'],
				name: v[i]['name'],
				thumbnail: thumb,
			});
		}

		setVideo(arr);
	}

	const groupOptionA : GroupOptions = {
		name: 'routine',
		pull: 'clone',
		put: false,
	};

	const groupOptionB : GroupOptions = {
		name: 'routine',
	};

	function onSetTitle(e: React.ChangeEvent<HTMLInputElement>) {
		setTitle(e.target.value);
	}

	function onDelete(index: number) {
		const arr = selected.slice();
		arr.splice(index, 1);

		setSelected(arr);
	}

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const ids : number[] = [];

		for (let i = 0; i < selected.length; i++) {
			ids.push(selected[i]['id']);
		}

		const routineDAO : RoutineDAO = {
			id: routineDTO.getNewId(),
			name: title,
			videos: ids,
		};

		const result = await routineDTO.addRoutine(routineDAO);
		if (result) {
			alert(`등록됨`);
			setRedirect(true);
		} else {
			alert(`등록 실패`);
		}
	}

	if (redirect) {
		return (<Redirect to='/routines' />);
	}

	return (
		<Root onSubmit={ onSubmit }>
			<Header text='나만의 루틴 만들기' />
			<ColumnTitle>루틴 명</ColumnTitle>
			<RoutineName placeholder='루틴 명' onChange={ onSetTitle } value={ title }/>
			<ColumnTitle>영상</ColumnTitle>
			<Title>영상 목록 ({ video.length })</Title>
			<Title>선택한 영상 ({ selected.length })</Title>
			<List>
				<ReactSortable
					group = { groupOptionA }
					animation={ 200 }
					list={ video }
					setList={ setVideo }
					sort={ false }
				>
					{ video.map((item: Video, index) => (
						<Item key={ index }>
							<Thumbnail src={ item.thumbnail }/>
							<Name> { item.name } </Name>
							<Text> { index } </Text>
						</Item>
					))}
				</ReactSortable>
			</List>
			<List>
				<ReactSortable
					group = { groupOptionB }
					animation={ 200 }
					list={ selected }
					setList={ setSelected }
				>
					{ selected.map((item: Video, index) => (
						<Item key={ index }>
							<Thumbnail src={ item.thumbnail }/>
							<Name> { item.name } </Name>
							<Delete onClick={ () => {
								onDelete(index);
							} }> { '삭제' } </Delete>
						</Item>
					))}
				</ReactSortable>
			</List>
			<Button text={ '등록' } />
		</Root>
	);
}

export default RoutineCreate;
