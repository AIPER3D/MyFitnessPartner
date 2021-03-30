import React, { useEffect, useState } from 'react';
import { RxDatabase } from 'rxdb';
import styled from 'styled-components';
import { Board, Content } from '../components/board';
import { Header, Button } from '../components/common';

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

function Videos({ db, setPage } : PageProps) {
	const [content, setContent] = useState<Content[]>([]);

	useEffect(() => {
		setPage('videos');
	}, []);

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
				thumbnail: doc[i].get('video_thumbnail'),
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
			<Header text='영상 관리' >
				<Btn>
					<Button href={ '/videos/new' } text={ '영상 등록' } />
				</Btn>
			</Header>
			<Board type='gallery' content={ content }/>
		</div>
	);
}

export default Videos;
