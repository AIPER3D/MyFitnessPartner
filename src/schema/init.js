import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RoutineSchema } from './routine';


async function init() {
	addRxPlugin(require('pouchdb-adapter-idb'));

	const db = await createRxDatabase({
		name: 'data',
		adapter: 'idb',
	});

	await db.addCollections({
		rouvtines: {
			schema: RoutineSchema,
		},
	});
}

(async () => {
	await init();
})();
