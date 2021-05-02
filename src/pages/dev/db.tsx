import React, { useEffect } from 'react';
import { createRxDatabase, RxDatabase } from 'rxdb';
import { Link } from 'react-router-dom';

import {
	ExerciseSchema,
	VideoSchema,
	RoutineSchema,
	RecordSchema,
	UserSchema,
	MemoSchema,
} from '../../db/schema';

function DB() {
	useEffect(() => {
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
					memos: {
						schema: MemoSchema,
					},
				});

				console.log(tdb);
			}, 3000);
		})();
	}, []);

	return (
		<div>
			<p>데이터베이스 생성</p>
			<ul>
				<li><Link to={ '/dev' } >돌아가기</Link></li>
			</ul>
		</div>
	);
}

export default DB;
