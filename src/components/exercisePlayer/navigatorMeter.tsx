import React, { useState } from 'react';
import styled, { css } from 'styled-components';

type Props = {
    exercise: string;
    time: number;
    accuracy: number;
};

type NeedleProps = {
    value: any;
};


function NavigatorMeter({ exercise, accuracy, time } : Props) {
	return (
		<Meter>
			<Speedo>
				<Face>
					<Needle value = { (accuracy * 100).toFixed(0) } />
				</Face>
			</Speedo>
			<TimeBack></TimeBack>
			<Time value={ time }></Time>
			<Name>{ exercise }</Name>
			<Acc>{ (accuracy * 100).toFixed(0) }</Acc>
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
	height: 100px;
	
	background-color: #2C363F;
	z-index: 1000000;
	
	padding: 50px 0px 0px 20px;
	
	border-radius: 5%;
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

const Needle = styled.div`
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
    transform: rotate(${ (props : NeedleProps) => (props.value * 1.8) - 90 }deg);
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

const Time = styled.div`
	display: block;
    position: absolute;
    top: 10px;
    padding-left: ${ (props : TimeProps) => (props.value * 160).toFixed(0) }px;
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

export default NavigatorMeter;
