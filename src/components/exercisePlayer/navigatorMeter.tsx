import React, { useState } from 'react';
import styled, { css } from 'styled-components';

type Props = {
    exercise: string;
    accuracy: number;
};

type NeedleProps = {
    value: number;
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
    width: 80px;+
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
    
    transition: all 2s;
    transform: rotate(${ (props : NeedleProps) => (props.value * 1.8) - 90 }deg);
`;

const Name = styled.div`
    position: absolute;
    top: 10px;
    width: 160px;
    
    text-align: center;
    color: #ffffff;
    font-weight: bold;
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

function NavigatorMeter({ exercise, accuracy } : Props) {
	return (
		<Meter>
			<Speedo>
				<Face>
					<Needle value = { accuracy } />
				</Face>
			</Speedo>
			<Name>{ exercise }</Name>
			<Acc>{ accuracy.toFixed(0) }</Acc>
		</Meter>
	);
}

NavigatorMeter.defaultProps = {

};

export default NavigatorMeter;
