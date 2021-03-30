import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { RxDatabase } from 'rxdb';

import { Link } from 'react-router-dom';
import { Board, Content } from '../components/board';
import {Button, Header} from '../components/common';

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
	const [content, setContent] = useState<Content[]>([]);

	useEffect(() => {
		setPage('routines');

		if (!db) return;
		(async () => {
			await select();
		})();
	}, [db]);

	async function select() {
		if (!db) return;
		if (!db.collections.routines) {
			setContent([]);
			return;
		}

		const doc = await db.collections.routines
			.find()
			.limit(5)
			.exec();

		const con : Content[] = [];
		for (let i = 0; i < doc.length; i++) {
			con.push({
				id: doc[i].get('routine_id'),
				title: doc[i].get('routine_name'),
				thumbnail: '',
			});
		}

		setContent(con);
	}

	async function insert() {
		if (!db) return;
		if (!db.collections.routines) {
			return;
		}

		await db.collections.routines.insert({
			routine_id: 0,
			routine_name: 'asdfasdfsdafsdaf',
		});
		await select();
	}

	async function clear() {
		if (!db) return;
		if (!db.collections.routines) {
			return;
		}

		await db.collections.routines.remove();
		await select();
	}


	return (
		<div>
			<Header text='루틴 관리' >
				<Btn>
					<Button href={ '/routines/new' } text={ '루틴 만들기' } />
				</Btn>
			</Header>
			<Board type='gallery' content={ content }/>
		</div>
	);
}

export default Routines;
