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

	getDB() {
		return this.db;
	}

	async addMemo(data: MemoDAO) {
		if (!this.db) return false;
		if (!this.db.collections.memos) return false;
		await this.db.collections.memos.insert({
			memo_id: data['memoId'],
			memo_date: data['memoDate'],
			memo_type: data['memoType'],
			memo_value: data['memoValue'],
		});

		return true;
	}

	async getCount(data: string) {
		if (!this.db) return 0;
		if (!this.db.collections.memos) return 0;

		const doc = await this.db.collections.memos
			.find()
			.where('memo_date')
			.eq(data)
			.exec();
		return doc.length;
	}

	async getMemo(data: string) {
		if (!this.db) return [];
		if (!this.db.collections.memos) return [];

		const doc = await this.db.collections.memos
			.find()
			.where('memo_date')
			.eq(data)
			.exec();
		const result : MemoDAO[] = [];
		for (let i =0; i < doc.length; i++) {
			result.push({
				memoId: doc[i].get('memo_id'),
				memoDate: doc[i].get('memo_date'),
				memoType: doc[i].get('memo_type'),
				memoValue: doc[i].get('memo_value'),
			});
		}
		result.sort(function(a, b) {
			return a.memoId - b.memoId;
		});
		return result;
	}

	async updateMemo(data: MemoDAO) {
		if (!this.db) return false;
		if (!this.db.collections.memos) return false;

		const doc = await this.db.collections.memos
			.findOne()
			.where({memo_id: data['memoId']})
			.update({ $set: {memo_value: data['memoValue'], memo_type: data['memoType']}});

		return true;
	}

	async deleteMemo(data: number) {
		if (!this.db) return false;
		if (!this.db.collections.memos) return false;

		const doc = await this.db.collections.memos
			.find()
			.where({memo_id: data})
			.remove();
		return true;
	}

	async isMemohere(data: string) {
		if (!this.db) return 0;
		if (!this.db.collections.memos) return 0;

		const doc = await this.db.collections.memos
			.find()
			.where({memo_date: data, memo_type: 'memo'})
			.exec();

		return doc.length;
	}

	async isCaloryhere(data: string) {
		if (!this.db) return 0;
		if (!this.db.collections.memos) return 0;

		const doc = await this.db.collections.memos
			.find()
			.where({memo_date: data, memo_type: 'calory'})
			.exec();

		return doc.length;
	}
}

export { MemoDTO };
