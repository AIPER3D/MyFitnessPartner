import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { RxDatabase } from 'rxdb';
import { Header } from '../components/common';
import { Board, Content } from '../components/board';
import { RoutineDTO } from '../db/DTO';
import { RoutineDAO } from '../db/DAO';

const Btn = styled.div`
	padding: 0px 0px 0px 0px;
	margin: 0px 0px 0px 0px;
		
	overflow: hidden;
	
	& > * {
		padding: 5px 5px 5px 5px;
		font-size: 10pt;
		width: 100px;
	}
`;

type PageProps = {
	db: RxDatabase;
};

interface Param {
	page: string;
}

function ExerciseReady({ db } : PageProps) {
	const perPage = 3;
	const history = useHistory();
	const { page } = useParams<Param>();

	const routineDTO = new RoutineDTO();
	const [content, setContent] = useState<Content[]>([]);
	const [maxPage, setMaxPage] = useState<Number>(0);

	useEffect(() => {
		routineDTO.setDB(db);
		select();
	}, [db]);

	async function select() {
		const skipContent = ((Number(page) - 1) * perPage);
		const routine : RoutineDAO[] = await routineDTO.getRoutinesByOffset(skipContent, perPage);
		setMaxPage(Math.ceil(await routineDTO.getCount() / perPage));

		const arr : Content[] = [];
		for (let i = 0; i < routine.length; i++) {
			let thumbnail = undefined;
			if (routine[i]['videos'].length > 0) {
				thumbnail = './files/thumbnails/' + routine[i]['videos'][0] + '.im';
			}

			arr.push({
				id: routine[i]['id'],
				title: routine[i]['name'],
				desc: 'id : ' + routine[i]['id'],
				thumbnail: thumbnail,
				onClick: onClick,
			});
		}

		setContent(arr);
	}
	function onClick(id: number) {
		history.push('/exercisePlay/' + id);
	}

	return (
		<div>
			<Header text='운동하기' />
			<Board
				type='list'
				content = { content }
				currentPage = { Number(page) }
				maxPage = { Number(maxPage) }
			/>
		</div>
	);
}

export default ExerciseReady;
