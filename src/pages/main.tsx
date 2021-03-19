import React, { useEffect, useState } from 'react';
import { Board, Content } from '../components/board';

function Main({ db } : any) {
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
