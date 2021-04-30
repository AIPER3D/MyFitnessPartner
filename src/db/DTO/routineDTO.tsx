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

	getDB() {
		return this.db;
	}

	getNewId() {
		return new Date().getTime();
	}

	async getCount() {
		if (!this.db) return 0;
		if (!this.db.collections.routines) return 0;

		const doc = await this.db.collections.routines
			.find()
			.exec();

		return doc.length;
	}

	async addRoutine(data : RoutineDAO) {
		if (!this.db) return false;
		if (!this.db.collections.routines) return false;

		const arr : number[] = [];
		for (let i = 0; i<data['videos'].length; i++) {
			arr.push(data['videos'][i]);
		}

		await this. db.collections.routines.insert({
			routine_id: data['id'],
			routine_name: data['name'],
			routine_videos: arr,
		});

		return true;
	}

	async getRoutineById(id : Number) {
		if (!this.db) return null;
		if (!this.db.collections.routines) return null;

		const doc = await this.db.collections.routines
			.find()
			.where('routine_id')
			.eq(id)
			.exec();

		if (doc.length <= 0) return null;

		const result: RoutineDAO = {
			id: doc[0].get('routine_id'),
			name: doc[0].get('routine_name'),
			videos: doc[0].get('routine_videos'),
		};

		return result;
	}

	async getRoutinesByOffset(offset : number, limit : number) {
		if (!this.db) return [];
		if (!this.db.collections.routines) return [];

		const doc = await this.db.collections.routines
			.find()
			.skip(offset)
			.limit(limit)
			.exec();

		const result : RoutineDAO[] = [];
		for (let i = 0; i < doc.length; i++) {
			result.push({
				id: doc[i].get('routine_id'),
				name: doc[i].get('routine_name'),
				videos: doc[i].get('routine_videos'),
			});
		}

		return result;
	}

	async getAllRoutinesAsArray() {
		if (!this.db) return [];
		if (!this.db.collections.routines) return [];

		const doc = await this.db.collections.routines
			.find()
			.exec();

		const result : RoutineDAO[] = [];
		for (let i = 0; i < doc.length; i++) {
			result.push({
				id: doc[i].get('routine_id'),
				name: doc[i].get('routine_name'),
				videos: doc[i].get('routine_videos'),
			});
		}

		return result;
	}

	async getAllRoutinesAsObject() {
		if (!this.db) return { };
    	if (!this.db.collections.routines) return { };

    	const doc = await this.db.collections.routines
    		.find()
    		.exec();

    	const result : {[key: number] : RoutineDAO} = { };
    	for (let i = 0; i < doc.length; i++) {
    		result[doc[i].get('routine_id')] = {
    			id: doc[i].get('routine_id'),
    			name: doc[i].get('routine_name'),
				videos: doc[i].get('routine_videos'),
    		};
    	}

    	return result;
	}
}

export { RoutineDTO };
