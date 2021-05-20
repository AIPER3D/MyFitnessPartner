import React, {useEffect, useState} from 'react';
import styled, { css } from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

type Props = {
	videoRef: HTMLVideoElement | null;
};

type ProgressProps = {
	width: string;
};

const Bottom = styled.div`
	position: absolute;
	display: block;
	
	top: calc(100vh - 50px);
	left: 0px;
	width: 100vw;
	height: 50px;
	
	background-color: #2C363F;
	z-index: 1000000;
`;

const ProgressBar = styled.div`
	width: 100vw;
	height: 5px;
	
	background-color: #CCCCCC;
`;

const ProgressLight = styled.div`
	width: ${ (props : ProgressProps) => props.width };
	height: 5px;
	
	background-color: #48ACF0;
`;

const NavTitle = styled.div`
	position: absolute;
	height: 25px;
	
	border-radius: 5px;
	margin-top: 11px;
	margin-left: 40px;
	
	color: #F2F5EA;
	text-align: left;
	font-weight: bold;
`;

const NavTime = styled.div`
	position: absolute;
	width: 150px;
	height: 25px;
	
	border-radius: 5px;
	margin-top: 10px;
	margin-left: calc(100% - 170px);
	
	background-color: #F2F5EA;
	text-align: center;
`;

const NavAccuracy = styled.div`
	position: absolute;
	width: 70px;
	height: 25px;
	
	border-radius: 5px;
	margin-top: 10px;
	margin-left: calc(100% - 250px);
	
	background-color: #F2F5EA;
	text-align: center;
`;

const Icon = styled(FontAwesomeIcon)`
	position: absolute;
	width: 24px;
	height: 24px;
	
	margin-top: 11px;
	margin-left: 11px;
	
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

function NavigatorBottom({ videoRef } : Props) {
	const [current, setCurrent] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);
	const [playing, setPlaying] = useState<boolean>(false);

	function digit(n : number) : string {
		if (n >= 10) return '' + n;
		else return '0' + n;
	}
	function getTime(time : number) : string {
		if (isNaN(time)) return '00:00';

		const h = Math.floor(time / 3600);
		time = time % 3600;

		const m = Math.floor(time / 60);
		time = time % 60;

		const s = Math.floor(time);

		return (h > 0 ? digit(h) + ':' : '') + digit(m) + ':' + digit(s);
	}
	function play() : void {
		if (videoRef == null) return;

		if (!playing) {
			videoRef.play()
				.then(() => {
					setPlaying(true);
				})
				.catch(() => {

				});
		} else {
			videoRef.pause();
			setPlaying(false);
		}
	}

	useEffect(() => {
		if (videoRef == null) return;

		videoRef.addEventListener('loadedmetadata', () => {
			setDuration(videoRef.duration);
			setPlaying(!videoRef.paused);
		});
		videoRef.addEventListener('timeupdate', () => {
			if (videoRef == null) return;
			setCurrent(videoRef.currentTime);
		});
	}, [videoRef]);

	return (
		<Bottom>
			<ProgressBar>
				<ProgressLight
					width = { (current / duration * 100) + '%' }
				/>
			</ProgressBar>
			{ playing ?
				(
					<Icon icon={faPause} size={'lg'} color={'#F2F5EA'} onClick={play}/>
				) :
				(
					<Icon icon={faPlay} size={'lg'} color={'#F2F5EA'} onClick={play} />
				)
			}
			<NavTime> { getTime(current) } / { getTime(duration) } </NavTime>
		</Bottom>
	);
}

NavigatorBottom.defaultProps = {

};

export default NavigatorBottom;
