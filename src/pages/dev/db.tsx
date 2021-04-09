import React, { useEffect } from 'react';
import {createRxDatabase, RxDatabase} from 'rxdb';

import {
	ExerciseSchema,
	VideoSchema,
	RoutineSchema,
	RecordSchema,
	UserSchema,
} from '../../db/schema';


type PageProps = {
	setPage: (page : string) => void;
};

function DB({ setPage } : PageProps) {
	useEffect(() => {
		setPage('db');

		(async () => {
			const tdb = await createRxDatabase({
				name: 'data',
				adapter: 'idb',
			});

			await tdb.remove();

			setTimeout(async () => {
				const tdb = await createRxDatabase({
					name: 'data',
					adapter: 'idb',
				});

				await tdb.addCollections({
					exercises: {
						schema: ExerciseSchema,
					},
					videos: {
						schema: VideoSchema,
					},
					routines: {
						schema: RoutineSchema,
					},
					records: {
						schema: RecordSchema,
					},
					users: {
						schema: UserSchema,
					},
				});

				console.log(tdb);
			}, 3000);
		})();
	}, []);

	return (
		<div>
			<p>데이터베이스 생성</p>
		</div>
	);
}

export default DB;
