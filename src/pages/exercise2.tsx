import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { RxDatabase } from 'rxdb';
import { VideoDTO, RoutineDTO } from '../db/DTO';
import { VideoDAO, RoutineDAO } from '../db/DAO';

import { Player } from '../components/exercisePlayer';

const Back = styled.div`
	position: absolute;
	display: block;
	
	top: 0px;
	left: 0px;
	width: calc(100vw - 250px);
	height: calc(100vh);
`;


type PageProps = {
    db: RxDatabase;
};

interface Param {
    page: string;
}

function Exercise2({ db } : PageProps) {
	const id = 1619602985935;
	const routineDTO = new RoutineDTO();
	const videoDTO = new VideoDTO();

	const [routine, setRoutine] = useState<RoutineDAO | null>(null);
	const [video, setVideo] = useState<VideoDAO[]>([]);

	useEffect(() => {
		routineDTO.setDB(db);
		videoDTO.setDB(db);

		select();
	}, [db]);

	async function select() {
		const routineData : RoutineDAO | null = await routineDTO.getRoutineById(id);
		if (routineData == null) return;

		setRoutine(routineData);

		const videoData : VideoDAO[] = await videoDTO.getVideosById(routineData.videos);
		if (videoData.length <= 0) return;

		setVideo(videoData);
	}

	if (routine == null || video.length <= 0) {
		return (
			<div> 오류 </div>
		);
	} else {
		return (
			<Back>
				<Player routine={ routine } video={ video } />
			</Back>
		);
	}
}

export default Exercise2;
