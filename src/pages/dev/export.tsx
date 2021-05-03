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
			window.api.fs.writeFileSync('./files/data.db', str);
		})();
	}, []);

	return (
		<div>
			<p>데이터베이스 내보내기</p>
			<ul>
				<li><Link to={ '/dev' } >돌아가기</Link></li>
			</ul>
		</div>
	);
}

export default Export;
