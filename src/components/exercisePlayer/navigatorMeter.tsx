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
				<Face value = { !accuracy ? '#FFFFFF' : accuracy > 0.8 ? '#32CD32' : accuracy > 0.5 ? '#FF8C01' :
					'#d8464f' }>
					<Needle value = { !accuracy ? '0' : accuracy > 0.8 ? '1' : accuracy > 0.5 ? '0.5' : '0' } />
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
	left: calc(100vw - 300px - 50px);
	width: 300px;
	height: 200px;
	
	background-color: #2C363F;
	z-index: 1000000;
	
	padding: 50px 0px 0px 20px;
	
	border-radius: 10px;
	opacity: 0.95;
`;

const Speedo = styled.div`
    width: 250px;
    height: 120px;
    margin: 20px 0px 0px 25px;
    overflow: hidden;
`;

const Face = styled.div.attrs((props : TimeProps) => ({
	style: {
		border: `solid 40px ` + props.value,
	},
}))<TimeProps>`
	width: 150px;
    height: 150px;
    border-radius: 50%;

    position: relative;
`;

const Needle = styled.div.attrs((props : TimeProps) => ({
	style: {
		transform: `rotate(` + ((props.value * 180) - 90) + 'deg' + `)`,
	},
}))<TimeProps>`
    width: 8px;
    height: 120px;
    background: #2C363F;
    border-color: #2C363F;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top-left-radius: 100%;
    border-top-right-radius: 100%;
    display: inline-block;
    left: 70px;
    position: absolute;
    top: -36px;
    transform-origin: bottom;
    
    transition: all 1s;
`;

const Name = styled.div`
    position: absolute;
    top: 13px;
    width: 280px;
    
    text-align: center;
    color: #000;
    font-weight: bold;
    font-size: 20px;
`;

type TimeProps = {
	value: any;
};

const TimeBack = styled.div`
	display: block;
    position: absolute;
    top: 10px;
    padding-left: 280px;
    height: 40px;
    
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
    height: 40px;
    
    text-align: center;
    color: #48ACF0;
    font-weight: bold;
    
    background: #48ACF0;
    border-radius: 1px;
    
    transition: all 1s;
`;

const Acc = styled.div`
    position: absolute;
    top: 138px;
    left: 78px;
    width: 160px;
    
    text-align: center;
    color: #ffffff;
    font-weight: bold;
    font-size: 42px;
`;

const Count = styled.div`
    position: absolute;
    top: 200px;
    left: 0px;
    width: 320px;
    height: 70px;
    
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #222222;
    text-align: center;
    color: #ffffff;
    font-weight: bold;
    font-size: 48px;
`;

export default NavigatorMeter;
