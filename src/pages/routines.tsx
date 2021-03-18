import React, { useEffect, useState } from 'react';
import { Board, Content } from '../components/board';

function Routines({ db } : any) {
	const [content, setContent] = useState<Content[]>([]);

	useEffect(() => {
		if (!db) return;
		(async () => {
			await select();
		})();
	}, [db]);

	async function select() {
		if (!db.collections.routines) {
			setContent([]);
			return;
		}

		const doc = await db.collections.routines
			.find()
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
		if (!db.collections.routines) {
			return;
		}

		await db.collections.routines.remove();
		await select();
	}


	return (
		<div className="App">
			<Board title='루틴 관리' type='list' content={ content }/>
			<input type='button' onClick={ insert } value='데이터 추가' />
			<input type='button' onClick={ clear } value='컬렉션 삭제' />
		</div>
	);
}

export default Routines;
