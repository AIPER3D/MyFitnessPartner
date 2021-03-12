import React, { useEffect, useState } from 'react';
import { Board, Content } from '../components/board';

const level = require('level');

function Videos() {
	const [content, setContent] = useState<Content[]>([]);
	const db = level('data', { valueEncoding: 'json' });

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

	return (
		<div className="App">
			<Board title='루틴 관리1234' type='gallery' content={ content }/>
			<input type='button' onClick={ ins } value='추가' />
			<input type='button' onClick={ del } value='삭제' />
		</div>
	);
}

export default Videos;
