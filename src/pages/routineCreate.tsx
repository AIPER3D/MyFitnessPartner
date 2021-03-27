import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { RxDatabase } from 'rxdb';
import { GroupOptions, ReactSortable } from 'react-sortablejs';

import { Header, Button } from '../components/common';
import dummy from './images/dummy.jpg';

interface ItemType {
	id: number;
	name: string;
}

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
	padding: 5px 5px 5px 15px;
	margin: 5px 20px 5px 20px;
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
	width: 100px;
	padding: 10px 10px 0px 10px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 10pt;
	font-weight: bold;
	text-align: left;
`;

const Text = styled.p`
	float: right;
	padding: 10px 10px 0px 10px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 9pt;
	text-align: left;
	overflow-y: scroll;
`;

type PageProps = {
	db: RxDatabase;
	setPage: (page : string) => void;
};

function RoutineCreate({ db, setPage } : PageProps) {
	const [video, setVideo] = useState<ItemType[]>([
		{
			id: 0,
			name: 'A',
		},
		{
			id: 1,
			name: 'B',
		},
	]);
	const [selected, setSelected] = useState<ItemType[]>([
		{
			id: 2,
			name: 'C',
		},
		{
			id: 3,
			name: 'D',
		},
	]);

	useEffect(() => {
		setPage('routines');
	}, []);

	const groupOptionA : GroupOptions = {
		name: 'routine',
		pull: 'clone',
		put: false,
	};

	const groupOptionB : GroupOptions = {
		name: 'routine',
	};

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const arr = [];
		for (let i = 0; i < selected.length; i++) {
			arr.push(selected[i].name);
		}
		alert(`선택 : ${ arr }`);
	}

	return (
		<Root onSubmit={ onSubmit }>
			<Header text='나만의 루틴 만들기' />
			<RoutineName placeholder='루틴 명' />
			<Title>영상 목록</Title>
			<Title>루틴</Title>
			<List>
				<ReactSortable
					group = { groupOptionA }
					animation={ 200 }
					list={ video }
					setList={ setVideo }
					sort={ false }
				>
					{ video.map((item: ItemType) => (
						<Item key={item.id}>
							<Thumbnail src={ dummy }/>
							<Name> { item.name } </Name>
							<Text> { '내용' } </Text>
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
					{ selected.map((item: ItemType) => (
						<Item key={item.id * 999}>
							<Thumbnail src={ dummy }/>
							<Name> { item.name } </Name>
							<Text> { '내용' } </Text>
						</Item>
					))}
				</ReactSortable>
			</List>
			<Button text={ '등록' } />
		</Root>
	);
}

export default RoutineCreate;
