import React from 'react';
import styled from 'styled-components';

type Props = {

};

const Container = styled.div`
	position: absolute;
	display: block;
	
	top: 0px;
	left: 0px;
	width: 640px;
	height: 360px;
	
	background-color: #2C363F;
	z-index: 1000005;
	
	opacity: 0.5;
`;


function PIP() {
	let down = false;
	let x = 0;
	let y = 0;

	function dragMouseDown(e : React.MouseEvent<HTMLDivElement>) {
		e.preventDefault();

		x = e.clientX - e.currentTarget.offsetLeft;
		y = e.clientY - e.currentTarget.offsetTop;
		down = true;
	}

	function dragMouseUp(e : React.MouseEvent<HTMLDivElement>) {
		e.preventDefault();

		x = 0;
		y = 0;
		down = false;
	}

	function dragMouse(e : React.DragEvent<HTMLDivElement>) {
		e.preventDefault();

		if (down != true) return;

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
		<Container
			onMouseDown = { dragMouseDown }
			onMouseUp = { dragMouseUp }
			onMouseMove = { dragMouse }
		>

		</Container>
	);
}

PIP.defaultProps = {

};

export default PIP;
