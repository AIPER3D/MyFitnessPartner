import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';

import { RxDatabase } from 'rxdb';
import { RecordDTO } from '../db/DTO';
import { RecordDAO } from '../db/DAO';

import { Button, Header } from '../components/common';
import { Board, Content } from '../components/board';

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

function Records({ db } : PageProps) {
	const perPage = 3;
	const { page } = useParams<Param>();

	const recordDTO = new RecordDTO();
	const [content, setContent] = useState<Content[]>([]);
	const [maxPage, setMaxPage] = useState<Number>(0);
	const [id, setId] = useState<Number>(0);

	useEffect(() => {
		recordDTO.setDB(db);
		select();
	}, [db, page]);

	async function select() {
		const skipContent = ((Number(page) - 1) * perPage);
		const record : RecordDAO[] = await recordDTO.getRecordsByOffset(skipContent, perPage);
		setMaxPage(Math.ceil(await recordDTO.getCount() / perPage));

		const arr : Content[] = [];
		for (let i = 0; i < record.length; i++) {
			const thumbnail = undefined;

			arr.push({
				id: record[i]['id'],
				title: record[i]['routineName'],
				desc: moment(record[i]['time']).format('YYYY-MM-DD HH:mm:ss'),
				thumbnail: thumbnail,
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
			<Redirect to = { '/record/' + id } />
		);
	} else {
		return (
			<div>
				<Header text='기록 관리' />
				<Board
					type='textlist'
					content={ content }
					currentPage={ Number(page) }
					maxPage={ Number(maxPage) }
				/>
			</div>
		);
	}
}

export default Records;
