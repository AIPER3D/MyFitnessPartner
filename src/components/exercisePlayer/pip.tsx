import React, {useState} from 'react';
import styled from 'styled-components';

import { Webcam } from './';

const Wrapper = styled.div`
	position: absolute;
	display: block;
	
	top: 0px;
	left: 0px;
	width: 640px;
	height: 360px;
	
	/* background-color: #2C363F; */
	z-index: 1005;
	
`;

function PIP() {
	const [down, setDown] = useState<boolean>(false);
	const [x, setX] = useState<number>(0);
	const [y, setY] = useState<number>(0);

	function dragMouseDown(e : React.MouseEvent<HTMLDivElement>) {
		e.preventDefault();

		setX(e.clientX - e.currentTarget.offsetLeft);
		setY(e.clientY - e.currentTarget.offsetTop);
		setDown(true);
	}

	function dragMouseUp(e : React.MouseEvent<HTMLDivElement>) {
		e.preventDefault();

		setX(0);
		setY(0);
		setDown(false);
	}

	function dragMouse(e : React.DragEvent<HTMLDivElement>) {
		e.preventDefault();

		if (!down) return;

		let toX = (e.clientX - x);
		if (toX < 0) {
			toX = 0;
		} else if (toX > (window.innerWidth - 640)) {
			toX = (window.innerWidth - 640);
		}

		let toY = (e.clientY - y);
		if (toY < 0) {
			toY = 0;
		} else if (toY >= (window.innerHeight - 360)) {
			toY = (window.innerHeight - 360);
		}

		e.currentTarget.style.left = toX + 'px';
		e.currentTarget.style.top = toY + 'px';
	}

	return (
		<Wrapper
			onMouseDown = { dragMouseDown }
			onMouseUp = { dragMouseUp }
			onMouseMove = { dragMouse }
		>

			<Webcam
				width = { 640 }
				height = { 320 }
				opacity = {0.5}
			/>
		</Wrapper>
	);
}

PIP.defaultProps = {

};

export default PIP;
