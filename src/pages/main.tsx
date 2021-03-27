import React, { useEffect, useState } from 'react';
import { RxDatabase } from 'rxdb';

type PageProps = {
	db: RxDatabase;
	setPage: (page : string) => void;
};

function Main({ db, setPage } : PageProps) {
	useEffect(() => {
		setPage('main');
	}, []);

	return (
		<div className="App">
			<p>Home</p>
			<p>* 이미지 경로 관련 수정 필요 (웹팩)</p>
			<p>* onClick 또 고장남 (ㅡㅡ)</p>
			<input type='button' value='모달 테스트' />
		</div>
	);
}

export default Main;
