import React, {useState} from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const color = {
	'dark': '#2C363F',
	'pink': '#E75A7C',
	'white': '#F2F5EA',
	'blue': '#48ACF0',
};

type MenuProps = {
    selected: string;
};

const NAV = styled.nav`
	position: fixed;
	width: 250px;
	height: calc(100vh - 20px);
	padding: 10px 0px 10px 0px;
	margin: 0px 20px 0px 0px;
	
	overflow: auto; 
	background-color: ${ color.dark };
`;

const UL = styled.ul`
    padding: 10px 0px 10px 0px;
	margin: 0px 0px 0px 0px;
	
	list-style: none;
`;

const LI = styled.li`			
    padding: 0px 0px 0px 0px;
	margin: 0px 0px 0px 0px;
	
	background-color: ${ color.dark };

	${(props) => {
		if (props.value == 'selected') {
			return css`
				width: 250px;
				background-color:${ color.blue };
				font-weight: bold;
			`;
		} else {
			return css`
			    &:hover {
					transition: all 0.5s;
					filter: brightness(125%);
    			}
			`;
		}
	}}
    
    ${'a'} {
    	display: block;
    	padding: 15px 0px 15px 15px;
    
    	color: ${ color.white };
        text-decoration: none;
    }
`;

const DIV = styled.div`
	overflow: auto;
`;

const MenuName = styled.p`
	display: inline;
	padding: 0px 0px 0px 15px;
`;

const Button = styled.a`
	display: block;
	width: 220px;
    padding: 15px 5px 15px 5px;
    margin: 15px 0px 10px 10px;
    
    background-color: ${ color.pink };
    text-decoration: none;
    text-align: center;
    color: #f2f5ea;
    
    &:hover {
		transition: all 0.5s;
		filter: brightness(110%);
    }
`;

const Profile = styled.img`
	float: left;
	width: 48px;
	height: 48px;
	margin: 5px 15px 5px 15px;
	
	border-radius: 24px;
	background-color: ${ color.white };
`;

const User = styled.div`
	float: left;
	display: inline;
	margin: 8px 0px 0px 0px;

	color: ${ color.white };
`;

const UserName = styled.p`
	display: inline;
	
	font-weight: bold;
`;

const UserStatus = styled.p`
	display: inline;
	
	font-size: 10pt;
`;

function Menu({ selected }: MenuProps) {
	return (
		<NAV>
			<DIV>
				<Profile />
				<User>
					<UserName>노영동</UserName>
					<br />
					<UserStatus>오늘 운동 미완료</UserStatus>
				</User>
			</DIV>
			<DIV>
				<Button href={'#'}>운동하기</Button>
			</DIV>
			<UL>
				<LI value={selected == 'main' ? 'selected' : ''}>
					<Link to="/">
						<FontAwesomeIcon icon={faHome} size={'lg'} color={'#f2f5ea'} />
						<MenuName>메인 화면</MenuName>
					</Link>
				</LI>
				<LI value={selected == 'videos' ? 'selected' : ''}>
					<Link to="/videos">
						<FontAwesomeIcon icon={faHome}size={'lg'} color={'#f2f5ea'} />
						<MenuName>영상 관리</MenuName>
					</Link>
				</LI>
				<LI value={selected == 'routines' ? 'selected' : ''}>
					<Link to="/routines">
						<FontAwesomeIcon icon={faHome} size={'lg'} color={'#f2f5ea'} />
						<MenuName>루틴 관리</MenuName>
					</Link>
				</LI>
				<LI value={selected == 'db' ? 'selected' : ''}>
					<Link to="/db">
						<FontAwesomeIcon icon={faHome} size={'lg'} color={'#f2f5ea'} />
						<MenuName>DB 생성</MenuName>
					</Link>
				</LI>
			</UL>
		</NAV>
	);
}

Menu.MenuProps = {

};

export default Menu;
