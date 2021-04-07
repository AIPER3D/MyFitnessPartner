import { RxDatabase } from 'rxdb';
import { VideoDAO, RoutineDAO } from '../DAO';

/* eslint-disable no-mixed-spaces-and-tabs */

class RoutineDTO {
	private db: RxDatabase | null;

	constructor() {
		this.db = null;
	}

	setDB(db : RxDatabase) {
		this.db = db;
	}

	async addRoutine(data : RoutineDAO) {
		if (!this.db) return false;
		if (!this.db.collections.routines) return false;

		await this. db.collections.routines.insert({
			routine_id: data['routineId'],
			routine_name: data['routineName'],
		});

		return true;
	}

	async getCount() {
		if (!this.db) return 0;
		if (!this.db.collections.routines) return 0;

		const doc = await this.db.collections.routines
			.find()
			.exec();

		return doc.length;
	}

	async getRoutineWithVideo() {
    	return { };
	}

	async getAllRoutines() {
		if (!this.db) return { };
    	if (!this.db.collections.routines) return { };

    	const doc = await this.db.collections.routines
    		.find()
    		.exec();

    	const result : {[key: number] : RoutineDAO} = { };
    	for (let i = 0; i < doc.length; i++) {
    		result[doc[i].get('routine_id')] = {
    			routineId: doc[i].get('routine_id'),
    			routineName: doc[i].get('routine_name'),
    			videos: [],
    		};
    	}

    	return result;
	}
}

export { RoutineDTO };
