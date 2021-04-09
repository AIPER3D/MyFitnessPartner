import { RxDatabase } from 'rxdb';
import { MemoDAO } from '../DAO';

/* eslint-disable no-mixed-spaces-and-tabs */

class MemoDTO {
	private db: RxDatabase | null;

	constructor() {
		this.db = null;
	}

	setDB(db : RxDatabase) {
		this.db = db;
	}

	async addMemo(data: MemoDAO) {
		if (!this.db) return false;
		if (!this.db.collections.memos) return false;

		await this. db.collections.memos.insert({
			memo_id: data['memoId'],
			memo_date: data['memoDate'],
			memo_type: data['memoType'],
			memo_value: data['memoValue'],
		});

		return true;
	}

	async getCount() {
		if (!this.db) return 0;
		if (!this.db.collections.memos) return 0;

		const doc = await this.db.collections.memos
			.find()
			.exec();

		return doc.length;
	}

	async getMemo(data: MemoDAO) {
		if (!this.db) return { };
		if (!this.db.collections.memos) return { };

		const doc = await this.db.collections.memos
			.find()
			.where('memo_date')
			.gt(data['memoDate'])
			.exec();

		const result : {[key:number] : MemoDAO} = { };
		for (let i =0; i < doc.length; i++) {
			result[i] = {
				memoId: doc[i].get('memo_id'),
				memoDate: doc[i].get('memo_date'),
				memoType: doc[i].get('memo_type'),
				memoValue: doc[i].get('memo_value'),
			};
		}
		return result;
	}
}

export { MemoDTO };
