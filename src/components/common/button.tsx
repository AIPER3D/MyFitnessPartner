import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const colorCode = {
	'dark': '#2C363F',
	'pink': '#E75A7C',
	'white': '#F2F5EA',
	'blue': '#48ACF0',
};

type ButtonProps = {
    text?: string;
    href?: string;
    color?: string;
    width?: string;
};

const style = css`
	display: block;
	width: ${ (props: ButtonProps) => props.width || '960px' };
    padding: 10px 0px 10px 0px;
    margin: 10px 20px 10px 20px;
    
    overflow: hidden;
    
    border-radius: 5px;
    background-color: ${ (props: ButtonProps) => props.color || '#2C363F' };
    text-decoration: none;
    text-align: center;
    color: #f2f5ea;
    
    &:hover {
		transition: all 0.5s;
		filter: brightness(125%);
    }
`;

const Submit = styled.input`
	border: none;
	outline: 0;
	cursor: pointer;
	${ style }
`;

const Go = styled(Link)`
	${ style }
`;

function Button({ text, href, color, width }: ButtonProps) {
	if (color && Object.keys(colorCode).includes(color)) {
		color = (colorCode as any)[color];
	} else {
		color = colorCode.dark;
	}

	if (href) {
		return (
			<Go
				to = { href }
				width = { width ? width : '960px' }
			>
				{ text ? text : '' }
			</Go>
		);
	} else {
		return (
			<Submit
				type = 'submit'
				color = { color }
				value = { text ? text : '' }
				width = { width ? width : '960px' }
			/>
		);
	}
}

Button.defaultProps = {

};

export default Button;
