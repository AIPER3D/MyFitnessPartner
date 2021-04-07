import React, { useEffect } from 'react';
import { createRxDatabase } from 'rxdb';

import {
	ExerciseSchema,
	VideoSchema,
	RoutineSchema,
	RecordSchema,
	UserSchema,
} from '../../db/schema';

function DB({ db } : any) {
	useEffect(() => {
		if (!db) return;

		(async () => {
			await db.remove();

			setTimeout(async () => {
				db = await createRxDatabase({
					name: 'data',
					adapter: 'idb',
				});

				await db.addCollections({
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

				console.log(db);
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
