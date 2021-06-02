import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';

import { RxDatabase } from 'rxdb';
import { Button, Header } from '../components/common';
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

function Routines({ db } : PageProps) {
	const perPage = 5;
	const { page } = useParams<Param>();

	const routineDTO = new RoutineDTO();
	const [content, setContent] = useState<Content[]>([]);
	const [maxPage, setMaxPage] = useState<Number>(0);

	useEffect(() => {
		routineDTO.setDB(db);
		select();
	}, [db, page]);

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
				desc: '등록일: ' + moment(routine[i]['id']).format('YYYY-MM-DD HH:mm:ss'),
				thumbnail: thumbnail,
				onClick: onClick,
			});
		}

		setContent(arr);
	}

	function onClick(id: number) {
		// console.log(id);
	}

	return (
		<div>
			<Header text='루틴 관리' >
				<Btn>
					<Button href={ '/routines/new' } text={ '루틴 만들기' } />
				</Btn>
			</Header>
			<Board
				type='list'
				content={ content }
				currentPage={ Number(page) }
				maxPage={ Number(maxPage) }
			/>
		</div>
	);
}

export default Routines;
