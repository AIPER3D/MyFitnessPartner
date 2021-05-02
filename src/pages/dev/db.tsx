import React, { useEffect } from 'react';
import {createRxDatabase, removeRxDatabase, RxDatabase} from 'rxdb';
import { Link } from 'react-router-dom';

import {
	UserSchema,
	MemoSchema,
	VideoSchema,
	RoutineSchema,
	RecordSchema,
} from '../../db/schema';

function DB() {
	useEffect(() => {
		(async () => {
			await removeRxDatabase('data', 'idb');

			setTimeout(async () => {
				const tdb = await createRxDatabase({
					name: 'data',
					adapter: 'idb',
				});

				await tdb.addCollections({
					users: {
						schema: UserSchema,
					},
					memos: {
						schema: MemoSchema,
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
