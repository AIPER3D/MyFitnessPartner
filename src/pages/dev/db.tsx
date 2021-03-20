import React, { useEffect } from 'react';

import {
	ExerciseSchema,
	VideoSchema,
	RoutineSchema,
	RecordSchema,
	UserSchema,
} from '../../schema';

function Routines({ db } : any) {
	useEffect(() => {
		if (!db) return;

		(async () => {
			await db.remove();

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
