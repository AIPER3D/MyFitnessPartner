import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import { RxDatabase } from 'rxdb';
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
	
	margin-top: calc(50vh - 150px);
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
    
    padding: 0px 50px 0px 10px;
    margin: ${ (props : InputProps) => props.vmargin };
    
    outline: none;
    border: 1px solid #CCCCCC;
    
    font-size: 15px;
    
    &:focus {
    border: 1px solid #48ACF0;
`;

type PageProps = {
	db: RxDatabase;
};

function New({ db } : PageProps) {
	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const name = (e.currentTarget.elements[0] as HTMLInputElement).value;

		const h = Number((e.currentTarget.elements[1] as HTMLInputElement).value);
		let height = h;
		if (isNaN(h)) height = 0;
		if (height <= 0) height = 0;
		if (height >= 1000) height = 999.9;
		height = Number(height.toFixed(1));

		const w = Number((e.currentTarget.elements[2] as HTMLInputElement).value);
		let weight = w;
		if (isNaN(w)) weight = 0;
		if (weight <= 0) weight = 0;
		if (weight >= 1000) weight = 999.9;
		weight = Number(weight.toFixed(1));

		console.log(name);
		console.log(h + ' > ' + height);
		console.log(w + ' > ' + weight);

		const source = window.api.fs.readFileSync('./files/data.db');
		const val = new TextDecoder().decode(source);
		const dump = JSON.parse(val);
		await db.importDump(dump);

		await db.collections.users.insert({
			id: 1,
			name: name,
			height: height,
			weight: weight,
		});

		window.location.replace('./');
	}

	return (
		<Body>
			<Form onSubmit = { onSubmit }>
				<Item>
					<Name>이름</Name>
					<Input vwidth = { '400px' } vmargin = { '0px 20px 15px 20px' } />
				</Item>

				<Item>
					<Name>키</Name>
					<Input type = { 'number ' } vwidth = { '150px' } vmargin = { '0px 20px 30px 20px' }/>
				</Item>

				<Item>
					<Name>몸무게</Name>
					<Input vwidth = { '150px' }	vmargin = { '0px 18px 30px 18px' }/>
				</Item>
				<Button text = { '시작하기' } width = { '100% - 40px' } />
				<Link to="/dev">개발자 모드</Link>
			</Form>
		</Body>
	);
}

export default New;
