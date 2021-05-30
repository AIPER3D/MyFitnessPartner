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
		
	padding: 10px 15px 10px 15px;
	margin: 10px 0px 20px 20px;
	overflow: auto;
`;

const Title = styled.div`
	width: 920px;
	padding-left: 20px;
	
	margin: 0px;
	
	font-weight: bold;
`;

type TextProps = {
	weight?: string;
}

const Text = styled.p`
	text-align: center;
	font-weight: ${ (props : TextProps) => props.weight };
	
	margin: 0px;
`;

const SubBox = styled.div`
	float: left;
	
	width: calc(100% - 10px);
	height: 50px;
	margin: 5px 5px 5px 5px;
	
	border: 1px solid #dddddd;
	background: #eeeeee;
`;

const SubTitle = styled.div`
	float: left;
	width: calc(100% - 200px);
	height: 20px;
	padding: 14px 0px 5px 15px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 12pt;
	font-weight: bold;
	text-align: left;
`;

const SubText = styled.p`
	float: left;
	width: calc(150px);
	height: 20px;
	padding: 16px 0px 0px 15px;
	margin: 0px 0px 0px 0px;
	
	color: #000000;
	font-size: 10pt;
	text-align: right;
	overflow-y: auto;
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
		const arr = [];
		for (let i = 0; i < record['recordExercise'].length; i++) {
			if (record['recordExercise'][i] != undefined) {
				arr.push(
					<SubBox key={i}>
						<SubTitle>{record['recordExercise'][i]['name']}</SubTitle>
						<SubText>{record['recordExercise'][i]['count']}회</SubText>
					</SubBox>
				);
			}
		}

		return (
			<div>
				<Header text='운동 기록' />
				<Box width = { '650px' } height = { '23px' }>
					<Text weight = {'bold'}> { routine['name'] } </Text>
				</Box>
				<Box width = { '210px' } height = { '23px' }>
					<Text> { record['createTime'] } </Text>
				</Box>
				<Title>진행한 운동</Title>
				<Box width = { '920px' } height= { '50px' }>
					{ arr }
				</Box>
				<Button href={ '/records/1' } text = { '확인' } />
			</div>
		);
	}
}

export default Record;
