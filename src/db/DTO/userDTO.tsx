import { RxDatabase } from 'rxdb';
import { UserDAO } from '../DAO';

/* eslint-disable no-mixed-spaces-and-tabs */

class UserDTO {
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

    async addUser(data : UserDAO) {
    	if (!this.db) return false;
    	if (!this.db.collections.users) return false;

    	await this.db.collections.users.insert({
    		user_id: 1,
    		user_name: data['name'],
    		user_gender: data['gender'],
    		user_age: data['age'],
    		user_height: data['height'],
    		user_weight: data['weight'],
    	});

    	return true;
    }

    async existUser() {
    	if (!this.db) return false;
    	if (!this.db.collections.users) return false;

    	const doc = await this.db.collections.users
    		.find()
    		.where('id')
    		.eq(1)
    		.exec();

    	if (doc.length > 0) return true;
    }

    async getUser() {
    	if (!this.db) return null;
    	if (!this.db.collections.users) return null;

    	const doc = await this.db.collections.users
    		.find()
    		.where('user_id')
    		.eq(1)
    		.exec();

    	if (doc.length <= 0) return null;

    	const result : UserDAO = {
    		id: doc[0].get('user_id'),
    		name: doc[0].get('user_name'),
    		gender: doc[0].get('user_gender'),
    		age: doc[0].get('user_age'),
    		height: doc[0].get('user_height'),
    		weight: doc[0].get('user_weight'),
    	};

    	return result;
    }

    async updateUser(data : UserDAO) {
    	if (!this.db) return false;
    	if (!this.db.collections.users) return false;

    	const doc = await this.db.collections.users
    		.find()
    		.where('user_id')
    		.eq(1)
    		.remove();

    	await this.addUser(data);
    	return true;
    }
}

export { UserDTO };
