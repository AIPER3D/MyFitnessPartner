import React, { useEffect, useState } from 'react';
import Calendar from '../components/calendar/calendar';
import { RxDatabase } from 'rxdb';

type PageProps = {
	db: RxDatabase;
};

function Main({ db } : PageProps) {
	function load(seq : number) {
		const file = window.api.fs.readFileSync('./files/videos/');
		const uint8Array = new Uint8Array(file);
		const arrayBuffer = uint8Array.buffer;
		const blob = new Blob([arrayBuffer]);
		const url = URL.createObjectURL(blob);
	}

	// return (
	// 	<Container>
	// 		<NavigatorTop
	// 			routine = { routine }
	// 			seq = { seq + 1 }
	// 		/>
	// 		<Video ref={ (ref) => {
	// 			setVideoRef(ref);
	// 		} } />
	// 		<NavigatorBottom
	// 			videoRef = { videoRef }
	// 		/>
	// 		<PIP/>
	// 	</Container>
	// );
	return (
		<div className="App">
		</div>
	);
}

export default Main;
