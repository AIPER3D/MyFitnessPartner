import moment from 'moment';
import { RxDatabase } from 'rxdb';
import { RecordDAO } from '../DAO';

/* eslint-disable no-mixed-spaces-and-tabs */

class RecordDTO {
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
    	if (!this.db.collections.records) return 0;

    	const doc = await this.db.collections.records
    		.find()
    		.exec();

    	return doc.length;
    }

    async addRecord(data : RecordDAO) {
    	if (!this.db) return -1;
    	if (!this.db.collections.records) return -1;

    	const id = this.getNewId();

    	await this.db.collections.records.insert({
    		record_id: id,
    		record_play_time: data['playTime'],
    		record_create_time: data['createTime'],
    		routine_id: data['routineId'],
    		routine_name: data['routineName'],
    		record_exercises: data['recordExercise'],
    	});

    	return id;
    }

    async getRecordById(id : Number) {
    	if (!this.db) return null;
    	if (!this.db.collections.records) return null;

    	const doc = await this.db.collections.records
    		.find()
    		.where('record_id')
    		.eq(id)
    		.exec();

    	if (doc.length <= 0) return null;

    	const result: RecordDAO = {
    		id: doc[0].get('record_id'),
    		playTime: doc[0].get('record_play_time'),
    		createTime: doc[0].get('record_create_time'),
    		routineId: doc[0].get('routine_id'),
    		routineName: doc[0].get('routine_name'),
    		recordExercise: doc[0].get('record_exercises'),
    	};

    	return result;
    }

    async getRecordsByOffset(offset : number, limit : number) {
    	if (!this.db) return [];
    	if (!this.db.collections.records) return [];

    	const doc = await this.db.collections.records
    		.find()
    		.skip(offset)
    		.limit(limit)
    		.sort({ record_id: 'desc' })
    		.exec();

    	const result : RecordDAO[] = [];
    	for (let i = 0; i < doc.length; i++) {
    		result.push({
    			id: doc[i].get('record_id'),
    			playTime: doc[i].get('record_play_time'),
    			createTime: doc[i].get('record_create_time'),
    			routineId: doc[i].get('routine_id'),
    			routineName: doc[i].get('routine_name'),
    			recordExercise: doc[i].get('record_exercises'),
    		});
    	}

    	return result;
    }

    async getAllRecords() {
    	if (!this.db) return [];
    	if (!this.db.collections.records) return [];

    	const doc = await this.db.collections.records
    		.find()
    		.exec();

    	const result : RecordDAO[] = [];
    	for (let i = 0; i < doc.length; i++) {
    		result.push({
    			id: doc[i].get('record_id'),
    			playTime: doc[i].get('record_play_time'),
    			createTime: doc[i].get('record_create_time'),
    			routineId: doc[i].get('routine_id'),
    			routineName: doc[i].get('routine_name'),
    			recordExercise: doc[i].get('record_exercises'),
    		});
    	}
    	return result;
    }


    async getTimeByDay(date : number) {
    	if (!this.db) return 0;
    	if (!this.db.collections.records) return 0;


    	const doc = await this.db.collections.records
    		.find()
    		.where('record_create_time')
    		.eq(date)
    		.exec();

    	let result = 0;
    	if (doc) {
    		for (let i=0; i< doc.length; i++) {
    			result += doc[i].get('record_play_time');
    		}
    	}
    	return result;
    }

    async getExerciseDay() {
    	if (!this.db) return 0;
    	if (!this.db.collections.records) return 0;

    	const doc = await this.db.collections.records
    		.find()
    		.exec();

    	let result: any[] = [];
    	for (let i = 0; i < doc.length; i++) {
    		result.push(doc[i].get('record_create_time'));
    	}

    	result = result.filter((item, i)=> {
    		return result.indexOf(item) === i;
    	});

    	return result.length;
    }

    async getExerciseDayRecord(date: number) {
    	if (!this.db) return [];
    	if (!this.db.collections.records) return [];

    	const doc = await this.db.collections.records
    		.find()
    		.where('record_create_time')
    		.eq(date)
    		.exec();

    	const result : RecordDAO[] = [];
    	for (let i = 0; i < doc.length; i++) {
    		result.push({
    			id: doc[i].get('record_id'),
    			playTime: doc[i].get('record_play_time'),
    			createTime: doc[i].get('record_create_time'),
    			routineId: doc[i].get('routine_id'),
    			routineName: doc[i].get('routine_name'),
    			recordExercise: doc[i].get('record_exercises'),
    		});
    	}

    	return result;
    }

    async getExerciseRecord() {
    	if (!this.db) return [];
    	if (!this.db.collections.records) return [];

    	const doc = await this.db.collections.records
    		.find()
    		.exec();

    	const result = {
    		Squat: 0,
    		Jump: 0,
    		Lunge: 0,
    	};

    	for (let i = 0; i < doc.length; i++) {
    		for (let j = 0; j < doc[i].get('record_exercises').length; j++) {
    			if (doc[i].get('record_exercises')[j]['name'] === 'Squat') {
    				result.Squat += doc[i].get('record_exercises')[j]['count'];
    			} else if (doc[i].get('record_exercises')[j]['name'] === 'Jump') {
    				result.Jump += doc[i].get('record_exercises')[j]['count'];
    			} else if (doc[i].get('record_exercises')[j]['name'] === 'Lunge') {
    				result.Lunge += doc[i].get('record_exercises')[j]['count'];
    			}
    		}
    	}

    	return result;
    }
}

export { RecordDTO };
