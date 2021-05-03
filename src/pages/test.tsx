import React, { useEffect, useState } from 'react';
import Calendar from '../components/calendar/calendar';
import { RxDatabase } from 'rxdb';

import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

type PageProps = {
	db: RxDatabase;
};

function Main({ db } : PageProps) {
	function load() {
		const file = window.api.fs.readFileSync('./files/videos/');
		const uint8Array = new Uint8Array(file);
		const arrayBuffer = uint8Array.buffer;
		const blob = new Blob([arrayBuffer]);
		const url = URL.createObjectURL(blob);
	}

	const run = async () => {
		// 1. model load
		const model = await mobilenet.load();

		// 2. get image from video
		const image = tf.tensor3d([3, 3, 3]);

		// 3. image to tensor
		model.classify(image);
	};

	useEffect( () => {
		load();

		run();
	}, []);

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
