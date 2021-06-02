import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { RoutineDAO, VideoDAO, RecordDAO } from '../../db/DAO';

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

type Props = {
	// poseLabel : any;
	// setRecordExercise : React.Dispatch<React.SetStateAction<RecordDAO['recordExercise']>>
	onLoaded: (val: boolean) => void;
};

function PIP({onLoaded } : Props) {
	const [down, setDown] = useState<boolean>(false);
	const [x, setX] = useState<number>(0);
	const [y, setY] = useState<number>(0);

	const [width, setWidth] = useState<number>(640);
	const [height, setHeight] = useState<number>(360);

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
		} else if (toX > (window.innerWidth - width)) {
			toX = (window.innerWidth - width);
		}

		let toY = (e.clientY - y);
		if (toY < 0) {
			toY = 0;
		} else if (toY >= (window.innerHeight - height)) {
			toY = (window.innerHeight - height);
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
				width = { width }
				height = { height }
				opacity = {0.5}
				onLoaded = { onLoaded }
			/>
		</Wrapper>
	);
}

PIP.defaultProps = {

};

export default PIP;
