import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import { RoutineDAO } from '../../db/DAO';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

type Props = {
	routine: RoutineDAO;
	seq: number;
};

type ProgressProps = {
	value: string;
};

const Top = styled.div`
	position: absolute;
	display: block;
	
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 50px;
	
	background-color: #2C363F;
	z-index: 1000000;
`;

const ProgressBar = styled.div`
	position: absolute;
	top: 45px;
	width: 100vw;
	height: 5px;
	
	background-color: #CCCCCC;
`;

const ProgressSeq = styled.div`
	position: absolute;
	left: ${ (props : ProgressProps) => props.value };
	width: 3px;
	height: 5px;
	
	background-color: #E75A7C;
`;

const ProgressLight = styled.div`
	position: absolute;
	left: 0px;
	width: ${ (props : ProgressProps) => props.value };
	height: 5px;
	
	background-color: #E75A7C;
`;

const NavTitle = styled.div`
	position: absolute;
	height: 25px;
	
	border-radius: 5px;
	margin-top: 10px;
	margin-left: 40px;
	
	color: #F2F5EA;
	text-align: left;
	font-weight: bold;
`;

const NavSeq = styled.div`
	position: absolute;
	width: 80px;
	height: 25px;
	
	border-radius: 5px;
	margin-top: 10px;
	margin-left: calc(100% - 100px);
	
	background-color: #F2F5EA;
	text-align: center;
`;

const Icon = styled(FontAwesomeIcon)`
	position: absolute;
	width: 24px;
	height: 24px;
	
	margin-top: 10px;
	margin-left: 10px;
	
	border-radius: 16px;
	transition: all 0.2s;
	transition-timing-function: ease-in-out;
	transform: scale(0.9, 0.9);
	opacity: 0.75;
	
	&:hover {
		opacity: 1;
	}
	
	&:active {
		transform: scale(1.1, 1.1);
		opacity: 0.5;
	}
`;

function NavigatorTop({ routine, seq } : Props) {
	const progressArr = [];

	for (let i = 0; i < routine['videos'].length; i++) {
		const val = (i / routine['videos'].length * 100);
		progressArr.push(<ProgressSeq key={ i } value={ val + '%' } />);
	}

	return (
		<Top>
			<Link to={'/'} >
				<Icon icon={ faArrowLeft } size={'lg'} color={'#F2F5EA'} />
			</Link>
			<NavTitle>{ routine['name'] }</NavTitle>
			<NavSeq>{ seq } / { routine['videos'].length }</NavSeq>
			<ProgressBar>
				<ProgressLight value={ (seq / routine['videos'].length * 100) + '%' } />
				{ progressArr }
			</ProgressBar>
		</Top>
	);
}

NavigatorTop.defaultProps = {

};

export default NavigatorTop;
