import React, { useEffect, useState } from 'react';
import Calendar from '../components/calendar/calendar';
import { RxDatabase } from 'rxdb';
import { Link } from 'react-router-dom';

type PageProps = {
	db: RxDatabase;
};

function Main({ db } : PageProps) {
	return (
		<div className="App">
			<Link to = { '/test' } >
			테스트 페이지로 이동
			</Link>
			<Calendar db={ db }/>
		</div>
	);
}

export default Main;
