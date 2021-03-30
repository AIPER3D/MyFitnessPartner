import React, { useEffect, useState } from 'react';
import { Header, Button } from '../components/common';
import { Uploader, Queue, Data } from '../components/file';

import { RxDatabase } from 'rxdb';

type PageProps = {
	db: RxDatabase;
	setPage: (page : string) => void;
};

function VideoCreate({ db, setPage } : PageProps) {
	const [data, setData] = useState<Data[]>([]);
	const [count, setCount] = useState<number>(0);

	useEffect(() => {
		setPage('videos');
	}, []);

	function addFile(fileList : FileList) {
		if (fileList.length <= 0) return;

		for (let i = 0; i < fileList.length; i++) {
			if (fileList[i]['type'].match(/video.*/)) {
				const d : Data = {
					file: fileList[i],
					reader: new FileReader(),
				};

				data.push(d);
				d.reader.readAsArrayBuffer(d.file);
			}
		}

		setCount(data.length);
	}

	return (
		<div>
			<Header text='영상 등록' >
			</Header>
			<Uploader method={ addFile } />
			<Queue db= { db } data={ data } />
		</div>
	);
}

export default VideoCreate;
