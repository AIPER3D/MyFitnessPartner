import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { RxDatabase } from 'rxdb';
import { VideoDTO, RoutineDTO, RecordDTO } from '../db/DTO';
import { VideoDAO, RoutineDAO, RecordDAO } from '../db/DAO';

import { Player } from '../components/exercisePlayer';

const Back = styled.div`
	background-color: #000000;
`;

type PageProps = {
    db: RxDatabase;
};

interface Param {
    id: string;
}

function Exercise2({ db } : PageProps) {
	const { id } = useParams<Param>();

	const routineDTO = new RoutineDTO();
	const videoDTO = new VideoDTO();

	const [routine, setRoutine] = useState<RoutineDAO | null>(null);
	const [video, setVideo] = useState<VideoDAO[]>([]);
	const [redirect, setRedirect] = useState<number>(0);

	useEffect(() => {
		routineDTO.setDB(db);
		videoDTO.setDB(db);

		select();
	}, [db]);

	async function select() {
		const routineData : RoutineDAO | null = await routineDTO.getRoutineById(Number(id));
		if (routineData == null) return;

		setRoutine(routineData);

		const videoData : VideoDAO[] = await videoDTO.getVideosById(routineData.videos);
		if (videoData.length <= 0) return;

		setVideo(videoData);
	}

	async function onEnded(record: RecordDAO) {
		const recordDTO = new RecordDTO();
		recordDTO.setDB(db);
		setRedirect(await recordDTO.addRecord(record));
	}

	if (redirect != 0) {
		return (
			<Redirect to={ redirect > 0 ? '/record/' + redirect : '/' } />
		);
	} else if (routine == null || video.length <= 0) {
		return (
			<Back />
		);
	} else {
		return (
			<Player routine={ routine } video={ video } onEnded={ onEnded }/>
		);
	}
}

export default Exercise2;
