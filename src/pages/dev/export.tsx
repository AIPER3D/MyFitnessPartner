const fs = window.require('fs');
import React, { useEffect } from 'react';
import { createRxDatabase } from 'rxdb';
import { Link } from 'react-router-dom';
import { MemoSchema, RoutineSchema, VideoSchema } from '../../db/schema';

import { RxDatabase } from 'rxdb';

type PageProps = {
	db: RxDatabase;
};

function Export({ db } : PageProps) {
	useEffect(() => {
		(async () => {
			const tdb = await createRxDatabase({
				name: 'data',
				adapter: 'idb',
				ignoreDuplicate: true,
			});

			await tdb.collection({
				name: 'routines',
				schema: RoutineSchema,
			});

			await tdb.collection({
				name: 'videos',
				schema: VideoSchema,
			});

			const dump = await tdb.dump();
			const str = JSON.stringify(dump);
			fs.writeFileSync('./files/data.db', str);
		})();
	}, []);

	return (
		<div>
			<p>데이터베이스 내보내기</p>
		</div>
	);
}

export default Export;
