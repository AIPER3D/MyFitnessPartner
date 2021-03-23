import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Board, Content } from '../components/board';
import { Header } from '../components/common';

function Videos({ db } : any) {
	const [content, setContent] = useState<Content[]>([]);

	useEffect(() => {
		if (!db) return;
		(async () => {
			await select();
		})();
	}, [db]);

	async function select() {
		if (!db.collections.videos) {
			setContent([]);
			return;
		}

		const doc = await db.collections.videos
			.find()
			.exec();

		const con : Content[] = [];
		for (let i = 0; i < doc.length; i++) {
			con.push({
				id: doc[i].get('video_id'),
				title: doc[i].get('video_name'),
			});
		}

		setContent(con);
	}

	async function insert() {
		if (!db.collections.videos) {
			return;
		}

		await db.collections.videos.insert({
			video_id: 0,
			video_name: 'asdfasdfsdafsdaf',
		});
		await select();
	}

	async function clear() {
		if (!db.collections.videos) {
			return;
		}

		await db.collections.videos.remove();
		await select();
	}


	return (
		<div className="App">
			<Header text='영상 관리' />
			<Board type='gallery' content={ content }/>
			<input type='button' onClick={ insert } value='데이터 추가' />
			<input type='button' onClick={ clear } value='컬렉션 삭제' />
			<Link to='/videos/new'>영상 추가</Link>
		</div>
	);
}

export default Videos;
