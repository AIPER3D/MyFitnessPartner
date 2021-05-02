import React, { useEffect } from 'react';
import { createRxDatabase } from 'rxdb';
import { Link } from 'react-router-dom';
import { MemoSchema, RoutineSchema, VideoSchema } from '../../db/schema';

function Export() {
	useEffect(() => {
		(async () => {
			const tdb = await createRxDatabase({
				name: 'data',
				adapter: 'idb',
			});

			await tdb.collection({
				name: 'routines',
				schema: RoutineSchema,
			});

			await tdb.collection({
				name: 'videos',
				schema: VideoSchema,
			});

			await tdb.collection({
				name: 'memos',
				schema: MemoSchema,
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
