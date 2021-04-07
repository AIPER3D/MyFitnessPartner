import React, {useState} from 'react';
import styled, { css } from 'styled-components';

import upload from './images/upload.png';

type UploaderProps = {
	method: (files: FileList) => void;
};

const Area = styled.div`
	padding: 40px 20px 40px 20px;
	margin: 0px 20px 10px 20px;
	
	border: 5px solid #eeeeee;
	overflow: auto;
	
	text-align: center;
	
	${(props) => {
		if (props.className == 'drag') {
			return css`
				transition: all 0.5s;
				filter: brightness(50%);
				
				${'img'} {
					transition: all 0.5s;
					filter: brightness(125%);
				}
			`;
		}
	}
}

`;

const Title = styled.div`
	margin: auto;
	color: #666666;
`;

function Uploader({ method } : UploaderProps) {
	const [drag, setDrag] = useState<boolean>(false);

	function dragOver(e: React.DragEvent<HTMLDivElement>) {
		e.stopPropagation();
		e.preventDefault();

		setDrag(true);
	}

	function dragLeave(e: React.DragEvent<HTMLDivElement>) {
		e.stopPropagation();
		e.preventDefault();

		setDrag(false);
	}

	function uploadFiles(e: React.DragEvent<HTMLDivElement>) {
		e.stopPropagation();
		e.preventDefault();

		setDrag(false);

		return e.dataTransfer.files;
	}

	return (
		<Area
			className={ drag ? 'drag' : '' }
			onDragOver={ dragOver }
			onDragLeave={ dragLeave }
			onDrop={ (e) => {
				method(uploadFiles(e));
			} }
		>
			<img src={ upload } width='64' height='64' />
			<Title>여기에 드래그하여 업로드</Title>
		</Area>
	);
}

Uploader.defaultProps = {

};

export default Uploader;
