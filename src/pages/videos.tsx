import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { RxDatabase } from 'rxdb';
import { Board, Content } from '../components/board';
import { Header, Button } from '../components/common';
import { VideoDTO } from '../db/DTO';
import { VideoDAO } from '../db/DAO';

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
	const videoDTO = new VideoDTO();
	const [content, setContent] = useState<Content[]>([]);

	useEffect(() => {
		setPage('videos');

		videoDTO.setDB(db);
		select();
	}, [db]);

	async function select() {
		const video : VideoDAO[] = await videoDTO.getAllVideosAsArray();

		const arr : Content[] = [];
		for (let i = 0; i < video.length; i++) {
			arr.push({
				id: video[i]['id'],
				title: video[i]['name'],
				thumbnail: video[i]['thumbnail'],
			});
		}

		setContent(arr);
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
