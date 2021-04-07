import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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
	setPage: (page : string) => void;
};

function Routines({ db, setPage } : PageProps) {
	const routineDTO = new RoutineDTO();
	const [content, setContent] = useState<Content[]>([]);

	useEffect(() => {
		setPage('routines');

		routineDTO.setDB(db);
		select();
	}, [db]);

	async function select() {
		const routine : {[key: string] : RoutineDAO} = await routineDTO.getAllRoutines();
		const key : string[] = Object.keys(routine);

		const arr : Content[] = [];
		for (let i = 0; i < key.length; i++) {
			arr.push({
				id: routine[key[i]]['routineId'],
				title: routine[key[i]]['routineName'],
				thumbnail: '',
			});
		}

		setContent(arr);
	}

	return (
		<div>
			<Header text='루틴 관리' >
				<Btn>
					<Button href={ '/routines/new' } text={ '루틴 만들기' } />
				</Btn>
			</Header>
			<Board type='list' content={ content }/>
		</div>
	);
}

export default Routines;
