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

    async getUser() {
    	if (!this.db) return null;
    	if (!this.db.collections.users) return null;

    	const doc = await this.db.collections.users
    		.find()
    		.where('id')
    		.eq(1)
    		.exec();

    	const result : UserDAO = {
    		id: doc[0].get('id'),
    		name: doc[0].get('name'),
    		height: doc[0].get('height'),
    		weight: doc[0].get('weight'),
    	};

    	return result;
    }
}

export { UserDTO };
