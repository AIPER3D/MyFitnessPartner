import React, { useEffect, useState } from 'react';
import Calendar from '../components/calendar/calendar';
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
			<Calendar />
		</div>
	);
}

export default Main;
