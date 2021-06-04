import React, {useContext, useState} from 'react';
import styled, { css } from 'styled-components';
import {playerContext} from './player';

type Props = {
    exercise: string;
    time: number;
    accuracy: number;
};

type NeedleProps = {
    value: any;
};

function NavigatorMeter({ exercise, accuracy, time } : Props) {
	const _playerContext = useContext(playerContext);

	return (
		<Meter>
			<Speedo>
				<Face>
					<Needle value = { accuracy ? ((accuracy * 180) - 90) + 'deg' : '-90deg' } />
				</Face>
			</Speedo>
			<TimeBack></TimeBack>
			<Time value={ (time * 160).toFixed(0) + 'px' }></Time>
			<Name>{ exercise }</Name>
			<Acc>{ accuracy ? (accuracy * 100).toFixed(0) : '?' }</Acc>
			<Count>{ _playerContext.currentCount }</Count>
		</Meter>
	);
}

NavigatorMeter.defaultProps = {

};


const Meter = styled.div`
	position: absolute;
	display: block;
	
	top: 70px;
	left: calc(100vw - 200px - 20px);
	width: 180px;
	height: 150px;
	
	background-color: #2C363F;
	z-index: 1000000;
	
	padding: 50px 0px 0px 20px;
	
	border-radius: 10px;
	opacity: 0.95;
`;

const Speedo = styled.div`
    width: 170px;
    height: 80px;
    margin: 0px;
    overflow: hidden;
`;

const Face = styled.div`
    width: 80px;
    height: 80px;
    border: solid 40px #fff;
    border-radius: 50%;

    position: relative;
`;

const Needle = styled.div.attrs((props : TimeProps) => ({
	style: {
		transform: `rotate(` + props.value + `)`,
	},
}))<TimeProps>`
    width: 4px;
    height: 70px;
    background: #2C363F;
    border-color: #2C363F;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top-left-radius: 100%;
    border-top-right-radius: 100%;
    display: inline-block;
    left: 38px;
    position: absolute;
    top: -36px;
    transform-origin: bottom;
    
    transition: all 1s;
`;

const Name = styled.div`
    position: absolute;
    top: 10px;
    width: 160px;
    
    text-align: center;
    color: #000;
    font-weight: bold;
`;

type TimeProps = {
	value: any;
};

const TimeBack = styled.div`
	display: block;
    position: absolute;
    top: 10px;
    padding-left: 160px;
    height: 25px;
    
    text-align: center;
    color: #ffffff;
    font-weight: bold;
    
    background: #ffffff;
    border-radius: 1px;
`;

const Time = styled.div.attrs((props : TimeProps) => ({
	style: {
		paddingLeft: props.value,
	},
}))<TimeProps>`
	display: block;
    position: absolute;
    top: 10px;
    height: 25px;
    
    text-align: center;
    color: #48ACF0;
    font-weight: bold;
    
    background: #48ACF0;
    border-radius: 1px;
    
    transition: all 1s;
`;

const Acc = styled.div`
    position: absolute;
    top: 105px;
    width: 160px;
    
    text-align: center;
    color: #ffffff;
    font-weight: bold;
    font-size: 26px;
`;

const Count = styled.div`
    position: absolute;
    top: 145px;
    left: 0px;
    width: 200px;
    height: 55px;
    
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #222222;
    text-align: center;
    color: #ffffff;
    font-weight: bold;
    font-size: 40px;
`;

export default NavigatorMeter;
