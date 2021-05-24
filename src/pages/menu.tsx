/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useEffect, useState, useRef} from 'react';
import styled, { css } from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faVideo, faList, faClipboard, faChartPie, faEdit } from '@fortawesome/free-solid-svg-icons';

import { RxDatabase } from 'rxdb';
import { UserDTO } from '../db/DTO';
import { UserDAO } from '../db/DAO';
import { Webcam } from '../components/exercisePlayer';
import DetectRTC from 'detectrtc';


const color = {
	'dark': '#2C363F',
	'pink': '#E75A7C',
	'white': '#F2F5EA',
	'blue': '#48ACF0',
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

const Bottom = styled.div`
	position: absolute;
	bottom: 5px;
	width: 250px;		
    padding: 0px 0px 0px 0px;
	margin: 0px 0px 0px 0px;
	
	background-color: ${ color.dark };

    ${'a'} {
    	display: block;
		padding: 0px 0px 0px 15px;
		margin: 0px 0px 10px 0px;
		
		color: #bbbbbb;
		text-decoration: none;
		font-size: 12pt;
		
		&:hover {
			transition: all 0.5s;
			filter: brightness(110%);
		}
    }
`;

const DIV = styled.div`
	overflow: auto;
`;

const MenuName = styled.p`
	position: relative;
	display: inline;
	top: 0px;
	left: 0px;
	
	padding: 0px 0px 0px 15px;
`;

const Button = styled(Link)`
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

const Icon = styled.div`
	display: inline-block;
	width: 24px;
	height: 24px;
	
	text-align: center;
`;

const Edit = styled(Link)`
	position: absolute;
	top: 10px;
	left: 220px;
	
	& > * {
		transition: 0.3s all;
		opacity: 0.6;
	}
	
	&:hover > * {
		transition: 0.3s all;
		opacity: 1.0;
	}
`;

type PageProps = {
	db: RxDatabase;
};

interface Param {
	route: string;
}

function Menu({ db } : PageProps) {
	const userDTO = new UserDTO();
	const { route } = useParams<Param>();
	const [user, setUser] = useState<UserDAO | null>(null);

	useEffect(() => {
		userDTO.setDB(db);
		select();
	}, [db]);

	useEffect(() => {
		detectWebcam(function(hasWebcam : any) {
			console.log(hasWebcam);
		});

		// webCamCheck();
	}, [route]);

	function detectWebcam(callback : any) {
		const md = navigator.mediaDevices;
		if (!md || !md.enumerateDevices) return callback(false);
		md.enumerateDevices().then((devices : any) => {
		  callback(devices.some((device : any) => 'videoinput' === device.kind));
		});
	}

	function webCamCheck() {
		console.log(DetectRTC.isWebRTCSupported);
		console.log(DetectRTC.audioInputDevices);	// (implemented)
		console.log(DetectRTC.audioOutputDevices);	// (implemented)
		console.log(DetectRTC.videoInputDevices);	// (implemented)
		if (DetectRTC.hasWebcam === false) {
			console.log(false);
		}
	}
	async function select() {
		setUser(await userDTO.getUser());
	}

	return (
		<NAV>
			<DIV>
				<Profile/>
				{ user ? (
					<User>
						<Edit to={'/userModify'}>
							<FontAwesomeIcon icon={ faEdit } size={'sm'} color={'#f2f5ea'}/>
						</Edit>
						<UserName>{ user.name }</UserName>
						<br/>
						<UserStatus>{ user.height.toFixed(1) }cm / { user.weight.toFixed(1) }kg</UserStatus>
					</User>
				) : (
					<User>
						<UserName></UserName>
						<br/>
						<UserStatus></UserStatus>
					</User>
				)}
			</DIV>
			<DIV>
				<Button to={ '/exerciseReady/1' }>운동하기</Button>
			</DIV>
			<UL>
				<LI value={route == undefined ? 'selected' : ''}>
					<Link to="/">
						<Icon>
							<FontAwesomeIcon icon={ faHome } size={'lg'} color={'#f2f5ea'}/>
						</Icon>
						<MenuName>메인 화면</MenuName>
					</Link>
				</LI>
				<LI value={route == 'dashboard' ? 'selected' : ''}>
					<Link to="/dashboard">
						<Icon>
							<FontAwesomeIcon icon={ faChartPie } size={'lg'} color={'#f2f5ea'}/>
						</Icon>
						<MenuName>대시보드</MenuName>
					</Link>
				</LI>
				<LI value={route == 'videos' || route == 'video' ? 'selected' : ''}>
					<Link to="/videos/1">
						<Icon>
							<FontAwesomeIcon icon={ faVideo } size={'lg'} color={'#f2f5ea'}/>
						</Icon>
						<MenuName>영상 관리</MenuName>
					</Link>
				</LI>
				<LI value={route == 'routines' ? 'selected' : ''}>
					<Link to="/routines/1">
						<Icon>
							<FontAwesomeIcon icon={ faList } size={'lg'} color={'#f2f5ea'}/>
						</Icon>
						<MenuName>루틴 관리</MenuName>
					</Link>
				</LI>
				<LI value={route == 'records' || route == 'record' ? 'selected' : ''}>
					<Link to="/records/1">
						<Icon>
							<FontAwesomeIcon icon={ faClipboard } size={'lg'} color={'#f2f5ea'}/>
						</Icon>
						<MenuName>기록 관리</MenuName>
					</Link>
				</LI>
				<Bottom>
					<Link to="/dev">개발자 모드</Link>
					<Link to="/reset">데이터 초기화</Link>
				</Bottom>
			</UL>
		</NAV>
	);
}

Menu.MenuProps = {

};

export default Menu;
