import React, { useEffect, useState } from 'react';
import {Redirect, useParams} from 'react-router-dom';
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
};

interface Param {
	page: string;
}

function Videos({ db } : PageProps) {
	const perPage = 6;
	const { page } = useParams<Param>();

	const videoDTO = new VideoDTO();
	const [content, setContent] = useState<Content[]>([]);
	const [maxPage, setMaxPage] = useState<Number>(0);
	const [id, setId] = useState<Number>(0);

	useEffect(() => {
		videoDTO.setDB(db);
		select();
	}, [db, page]);

	async function select() {
		const skipContent = ((Number(page) - 1) * perPage);
		const video : VideoDAO[] = await videoDTO.getVideosByOffset(skipContent, perPage);
		setMaxPage(Math.ceil(await videoDTO.getCount() / perPage));

		const arr : Content[] = [];
		for (let i = 0; i < video.length; i++) {
			arr.push({
				id: video[i]['id'],
				title: video[i]['name'],
				desc: 'id: ' + video[i]['id'],
				thumbnail: './files/thumbnails/' + video[i]['id'] + '.im',
				onClick: onClick,
			});
		}
		setContent(arr);
	}

	function onClick(id: number) {
		setId(id);
	}

	if (id != 0) {
		return (
			<Redirect to = { '/video/' + id } />
		);
	} else {
		return (
			<div className="App">
				<Header text='영상 관리'>
					<Btn>
						<Button href={'/videos/new'} text={'영상 등록'}/>
					</Btn>
				</Header>
				<Board
					type='gallery'
					content={content}
					currentPage={Number(page)}
					maxPage={Number(maxPage)}
				/>
			</div>
		);
	}
}

export default Videos;
