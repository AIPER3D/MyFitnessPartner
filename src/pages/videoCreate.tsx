import React, { useEffect, useState } from 'react';
import { List, Content } from '../components/board';
import { Header } from '../components/common';
import { Upload } from '../components/file';

function VideoCreate() {
	const content : Content = {
		id: 0,
		title: '',
	};

	return (
		<div >
			<Header text='영상 등록' />
			<Upload>
				<List content={ content }></List>
			</Upload>
		</div>
	);
}

export default VideoCreate;
