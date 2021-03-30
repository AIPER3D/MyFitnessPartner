import React from 'react';
import styled from 'styled-components';
import { Button } from './';

type HeaderProps = {
    text: string;
    children?: React.ReactElement<any> | React.ReactElement<any>[];
};

const Box = styled.div`
	height: 50px;
	border: 5px solid #eeeeee;
	padding: 10px 10px 10px 10px;
	margin: 0px 20px 10px 20px;
	
	font-size: 14pt;
	overflow: auto;
`;

const Title = styled.p`
	float: left;
	padding: 13px 0px 0px 10px;
	margin: 0px 0px 0px 0px;
	
	font-size: 14pt;
`;

const Children = styled.div`
	float: right;
	
	& > * {

	}
`;

function Header({ text, children }: HeaderProps) {
	return (
		<Box>
			<Title> {text} </Title>
			<Children> { children } </Children>
		</Box>
	);
}

Header.defaultProps = {

};

export default Header;
