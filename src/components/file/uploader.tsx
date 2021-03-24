import React from 'react';
import styled from 'styled-components';

type UploaderProps = {
	method: (files: FileList) => void;
};

const Area = styled.div`
	height: 300px;
	padding: 20px 20px 20px 20px;
	margin: 0px 20px 10px 20px;
	
	border: 5px solid #eeeeee;
	overflow: auto;
`;

const Title = styled.div`

`;

function dragOver(e: React.DragEvent<HTMLDivElement>) {
	e.stopPropagation();
	e.preventDefault();
}

function dragLeave(e: React.DragEvent<HTMLDivElement>) {
	e.stopPropagation();
	e.preventDefault();
}

function uploadFiles(e: React.DragEvent<HTMLDivElement>) {
	e.stopPropagation();
	e.preventDefault();

	dragOver(e);

	return e.dataTransfer.files;
}

function Uploader({ method } : UploaderProps) {
	return (
		<Area
			onDragOver = { dragOver }
			onDragLeave = { dragLeave }
			onDrop = { (e) => {
				method(uploadFiles(e));
			} }
		>
			<p>여기에 드래그하여 업로드</p>
		</Area>
	);
}

Uploader.defaultProps = {

};

export default Uploader;
