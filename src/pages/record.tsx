import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';

import { RxDatabase } from 'rxdb';
import { RoutineDTO, RecordDTO } from '../db/DTO';
import { RoutineDAO, RecordDAO } from '../db/DAO';

import { Header, Button } from '../components/common';

type BoxProps = {
	width: string;
	height?: string;
}

const Box = styled.div`
	float: left;
    width: calc(${ (props : BoxProps) => props.width });
    min-height: calc(${ (props : BoxProps) => props.height ? props.height : '50px' });
    max-height: calc(600px);
	border: 5px solid #eeeeee;
	overflow: auto;
		
	padding: 5px 15px 5px 15px;
	margin: 10px 0px 20px 20px;
	overflow: auto;
`;

const Title = styled.div`
	width: 920px;
	padding-left: 20px;
	
	font-weight: bold;
`;

type TextProps = {
	weight?: string;
}

const Text = styled.p`
	text-align: center;
	font-weight: ${ (props : TextProps) => props.weight }
`;

type PageProps = {
	db: RxDatabase;
};

interface Param {
	id: string;
}

function Record({ db } : PageProps) {
	const { id } = useParams<Param>();

	const routineDTO = new RoutineDTO();
	const recordDTO = new RecordDTO();
	const [routine, setRoutine] = useState<RoutineDAO | null>(null);
	const [record, setRecord] = useState<RecordDAO | null>(null);

	useEffect(() => {
		routineDTO.setDB(db);
		recordDTO.setDB(db);
		load();
	}, [db]);

	async function load() {
		const re: RecordDAO | null = await recordDTO.getRecordById(Number(id));
		if (re != null) {
			setRecord(re);
			const ro: RoutineDAO | null = await routineDTO.getRoutineById(Number(re['routineId']));
			if (ro != null) {
				setRoutine(ro);
			}
		}
	}

	if (record == null || routine == null) {
		return (
			<div>
				<Header text='운동 기록' />
			</div>
		);
	} else {
		return (
			<div>
				<Header text='운동 기록' />
				<Box width = { '650px' }>
					<Text weight = {'bold'}> { routine['name'] } </Text>
				</Box>
				<Box width = { '210px' }>
					<Text> { moment(record['time']).format('YYYY-MM-DD HH:mm:ss') } </Text>
				</Box>
				<Title>진행한 운동</Title>
				<Box width = { '920px' } height= { '50px' }>
					<Text> 운동 </Text>
				</Box>
				<Button href={ '/records/1' } text = { '확인' } />
			</div>
		);
	}
}

export default Record;
