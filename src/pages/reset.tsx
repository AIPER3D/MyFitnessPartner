import React, {useState} from 'react';
import styled from 'styled-components';
import { removeRxDatabase, RxDatabase } from 'rxdb';
import { Button } from '../components/common';
import {Redirect} from "react-router-dom";

const Body = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    
    padding: 0px;
    margin: 0px;
    
    background-color: #F2F5EA;
`;

const Form = styled.form`
	width: 500px;
	height: 300px;
	overflow: hidden;
	
	margin-top: calc(50vh - 170px);
	margin-left: auto;
	margin-right: auto;
	padding: 20px 0px 0px 0px;
`;

const Name = styled.p`
    margin: 5px 0px 5px 20px;
    
    font-size: 15px;
    font-weight: bold;
`;

const Box = styled.div`
    width: 500px
    height: 50px;
    
    padding: 0px 50px 0px 20px;
    margin: 0px 20px 0px 20px;
    
    outline: none;
    border: 1px solid #CCCCCC;
    
    font-size: 15px;
    
    &:focus {
    border: 1px solid #48ACF0;
`;

type PageProps = {
	db: RxDatabase;
};

function Reset({ db } : PageProps) {
	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		await removeRxDatabase('data', 'idb');

		window.location.replace('./');
	}
	const [redirect, setRedirect] = useState<number>(0);

	if (redirect != 0) {
		return (
			<Redirect to={'/'}/>
		);
	} else {
		return (
			<Body>
				<Button href={'/'} text={'돌아가기'} width={'100px'}/>
				<Form onSubmit={onSubmit}>
					<Name>데이터 초기화</Name>
					<Box>
						<p>사용자, 영상, 루틴, 기록 데이터를 초기화합니다. <br/>데이터가 삭제된 후 복구할 수 없습니다.</p>
						<p>(기본 영상, 루틴은 삭제되지 않습니다.)</p>
					</Box>
					<Button text={'초기화'} width={'100% - 40px'} color={'pink'}/>
				</Form>

			</Body>
		);
	}
}

export default Reset;
