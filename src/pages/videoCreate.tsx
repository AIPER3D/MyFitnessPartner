import React, { useEffect, useState } from 'react';
import { Header } from '../components/common';
import { Uploader, Queue } from '../components/file';

function VideoCreate() {
	const [queue, setQueue] = useState<File[]>([]);
	const [count, setCount] = useState<number>(0);

	function addFile(fileList : FileList) {
		if (fileList.length <= 0) return;

		for (let i = 0; i < fileList.length; i++) {
			if (fileList[0]['type'].match(/video.*/)) {
				queue.push(fileList[i]);
			} else {
				queue.push(fileList[i]); // [확인용] 일시적으로 영상 파일이 아니어도 등록
			}
		}

		setCount(queue.length);
	}

	return (
		<div>
			<Header text='영상 등록' />
			<Uploader method={ addFile } />
			<Queue queue={ queue } />
		</div>
	);
}

export default VideoCreate;
