import React from 'react';
import styled from 'styled-components';

type HeaderProps = {
    text: string;
};

const Title = styled.div`
	border: 5px solid #eeeeee;
	padding: 20px 20px 20px 20px;
	margin: 0px 20px 10px 20px;
	
	font-size: 14pt;
	overflow: auto;
`;

function Header({ text }: HeaderProps) {
	return (
		<div>
			<Title> { text } </Title>
		</div>
	);
}

Header.defaultProps = {

};

export default Header;
