const fs = window.require('fs');
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Link, Redirect} from 'react-router-dom';

import { RxDatabase } from 'rxdb';
import { UserDTO } from '../db/DTO';
import { UserDAO } from '../db/DAO';

import { Button } from '../components/common';

type InputProps = {
    vwidth: string;
    vmargin: string;
}

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

const Item = styled.div`
    float: left;
    
    overflow: auto;
`;

const Name = styled.p`
    margin: 5px 0px 5px 20px;
    
    font-size: 15px;
    font-weight: bold;
`;

const Input = styled.input`
    width: calc(${ (props : InputProps) => props.vwidth });
    height: 50px;
    
    padding: 0px 10px 0px 10px;
    margin: ${ (props : InputProps) => props.vmargin };
    
    outline: none;
    border: 1px solid #CCCCCC;
    
    font-size: 15px;
    
    &:focus {
    	border: 1px solid #48ACF0;
    }
`;

const RadioName = styled.p`
    margin: 5px 0px 5px 20px;
    
    font-size: 15px;
    font-weight: bold;
`;

const Select = styled.select`
    width: calc(${ (props : InputProps) => props.vwidth });
    height: 50px;
    
    padding: 0px 10px 0px 10px;
    margin: ${ (props : InputProps) => props.vmargin };
    
    outline: none;
    border: 1px solid #CCCCCC;
    
    font-size: 15px;
    
    &:focus {
    	border: 1px solid #48ACF0;
    }
`;

type PageProps = {
	db: RxDatabase;
	setNewMode: any;
};

function UserNew({ db, setNewMode } : PageProps) {
	const userDTO = new UserDTO();
	const [redirect, setRedirect] = useState<number>(0);

	useEffect(() => {
		userDTO.setDB(db);
	}, [db]);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const name = (e.currentTarget.elements[0] as HTMLInputElement).value;

		const g = (e.currentTarget.elements[1] as HTMLSelectElement).value;
		console.log(g);

		const a = Number((e.currentTarget.elements[2] as HTMLInputElement).value);
		let age = a;
		if (isNaN(a)) age = 0;
		if (age <= 0) age = 0;
		if (age >= 100) age = 100;
		age = Number(age.toFixed(0));

		const h = Number((e.currentTarget.elements[3] as HTMLInputElement).value);
		let height = h;
		if (isNaN(h)) height = 0;
		if (height <= 0) height = 0;
		if (height >= 1000) height = 999.9;
		height = Number(height.toFixed(1));

		const w = Number((e.currentTarget.elements[4] as HTMLInputElement).value);
		let weight = w;
		if (isNaN(w)) weight = 0;
		if (weight <= 0) weight = 0;
		if (weight >= 1000) weight = 999.9;
		weight = Number(weight.toFixed(1));

		console.log(name);
		console.log(h + ' > ' + height);
		console.log(w + ' > ' + weight);

		const source = fs.readFileSync('./files/data.db');
		const val = new TextDecoder().decode(source);
		const dump = JSON.parse(val);
		await db.importDump(dump);


		const user : UserDAO = {
			id: 1,
			name: name,
			gender: g,
			age: age,
			height: height,
			weight: weight,
		};
		await userDTO.addUser(user);

		setNewMode(false);
		setRedirect(1);
	}

	if (redirect != 0) {
		return (
			<Redirect to={'/'}/>
		);
	} else {
		return (
			<Body>
				<Form onSubmit = { onSubmit }>
					<Item>
						<Name>이름</Name>
						<Input vwidth = { '296px' } vmargin = { '0px 20px 15px 20px' } />
					</Item>

					<Item>
						<Name>성별</Name>
						<Select vwidth = { '111px' } vmargin = { '0px 20px 30px 10px' } >
							<option value={ '' }>미선택</option>
							<option value={ 'M' }>남자</option>
							<option value={ 'F' }>여자</option>
						</Select>
					</Item>

					<Item>
						<Name>나이</Name>
						<Input
							type={ 'number' }
							required={ true }
							min={ 1 }
							vwidth={ '111px' }
							vmargin={ '0px 20px 30px 20px' }
						/>
					</Item>

					<Item>
						<Name>키</Name>
						<Input
							type={ 'number' }
							required={ true }
							min={ 1 }
							step={ '0.1' }
							vwidth={ '111px' }
							vmargin = { '0px 20px 30px 10px' }
						/>
					</Item>

					<Item>
						<Name>몸무게</Name>
						<Input
							type={ 'number' }
							required={ true }
							min={ 1 }
							step={ '0.1' }
							vwidth={ '111px' }
							vmargin={ '0px 20px 30px 10px' }
						/>
					</Item>
					<Button text = { '시작하기' } width = { '100% - 40px' } />
					<Link to="/dev">개발자 모드</Link>
				</Form>
			</Body>
		);
	}
}

export default UserNew;
