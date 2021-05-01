import React, { useEffect, useState } from 'react';
import Calendar from '../components/calendar/calendar';
import { RxDatabase } from 'rxdb';

type PageProps = {
	db: RxDatabase;
};

function Main({ db } : PageProps) {
	return (
		<div className="App">
			<Calendar db={ db }/>
		</div>
	);
}

export default Main;
