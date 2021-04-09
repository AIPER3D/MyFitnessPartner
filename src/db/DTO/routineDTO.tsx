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
			arr.push(data['videos'][i]['id']);
		}

		await this. db.collections.routines.insert({
			routine_id: data['id'],
			routine_name: data['name'],
			videos: arr,
		});

		return true;
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
				videos: [],
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
    			videos: [],
    		};
    	}

    	return result;
	}
}

export { RoutineDTO };
