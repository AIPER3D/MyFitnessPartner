import React, { useEffect } from 'react';

import { createRxDatabase, addRxPlugin } from 'rxdb';
import {
	ExerciseSchema,
	VideoSchema,
	RoutineSchema,
	RecordSchema,
	UserSchema,
} from '../../schema';

function Routines() {
	useEffect(() => {
		(async () => {
			addRxPlugin(require('pouchdb-adapter-idb'));

			const db = await createRxDatabase({
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
		})();
	}, []);

	return (
		<div>
			<p>데이터베이스 생성</p>
		</div>
	);
}

export default Routines;
