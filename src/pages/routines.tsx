import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Board, Content } from '../components/board';
import { Header } from '../components/common';

function Routines({ db } : any) {
	const [content, setContent] = useState<Content[]>([]);

	useEffect(() => {
		console.log(db);
		if (!db) return;
		(async () => {
			await select();
		})();
	}, [db]);

	async function select() {
		console.log(db);
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
			});
		}

		setContent(con);
	}

	async function insert() {
		console.log(db);
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
		console.log(db);
		if (!db) return;
		if (!db.collections.routines) {
			return;
		}

		await db.collections.routines.remove();
		await select();
	}


	return (
		<div>
			<Header text='루틴 관리' />
			<Board type='gallery' content={ content }/>
			<input type='button' onClick={ insert } value='데이터 추가' />
			<input type='button' onClick={ (e) => {
				e.preventDefault();
				console.log('...');
			} } value='컬렉션 삭제' />
			<Link to='/routines/new'>루틴 추가</Link>
		</div>
	);
}

export default Routines;
