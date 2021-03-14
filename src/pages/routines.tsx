import React, { useEffect, useState } from 'react';
import { Board, Content } from '../components/board';

import { createRxDatabase, addRxPlugin } from 'rxdb';
import { RoutineSchema } from '../schema/routine';

function Routines() {
	/*
	useEffect(() => {
		(async () => {
			addRxPlugin(require('pouchdb-adapter-idb'));

			const db = await createRxDatabase({
				name: 'data',
				adapter: 'idb',
			});

			await db.addCollections({
				routines: {
					schema: RoutineSchema,
				},
			});

			console.log(db['routines']);
		})();
	}, []);
	*/
	/*
	(async () => {
		addRxPlugin(require('pouchdb-adapter-leveldb'));
		// const leveldown = require('leveldown');

		// console.log(leveldown);
		// if (!leveldown) console.log('1111');
		// if (typeof leveldown.super_ !== 'function') console.log('2222');

		const db = await createRxDatabase({
			name: 'data',
			adapter: leveldown,
		});

		await db.collection({
			name: 'routines',
			schema: require('../schema/routine.json'),
		});

		await db['routines'].insert({
			routine_id: 0,
			routine_name: 'Bob',
		});

		console.log(db);
	})();

	const [content, setContent] = useState<Content[]>([]);

	const ins = () => {
		db.get('key', (err : any, value : any) => {
			if (err) value = [];

			value.push({
				id: Math.random(),
				title: '데이터베이스 루틴 (2)',
			});

			db.put('key', value, (err: any) => {
				if (err) return console.log('삽입 오류', err);
				console.log(value);
				setContent(value);
			});
		});
	};
	const del = () => {
		db.del('key', (err : any) => {
			if (err) return console.error(err);

			setContent([]);
		});
	};

	useEffect(() => {
		db.get('key', (err : any, value : any) => {
			if (err) return console.error(err);

			setContent(value);
			console.log(value);
		});
	}, []);
	*/

	return (
		<div className="App">
			<Board title='루틴 관리1234' type='gallery' content={ [] }/>
			<input type='button' value='추가' />
			<input type='button' value='삭제' />
		</div>
	);
}

export default Routines;
