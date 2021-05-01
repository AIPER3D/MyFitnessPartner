import { RxDatabase } from 'rxdb';
import { VideoDAO } from '../DAO';

/* eslint-disable no-mixed-spaces-and-tabs */

class VideoDTO {
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
		if (!this.db.collections.videos) return 0;

		const doc = await this.db.collections.videos
			.find()
			.exec();

		return doc.length;
	}

	async addVideo(data : VideoDAO) {
		if (!this.db) return false;
		if (!this.db.collections.videos) return false;

		await this. db.collections.videos.insert({
			video_id: data['id'],
			video_name: data['name'],
			video_timeline: [],
		});

		return true;
	}

	getVideo(id : number) {
    	return { };
	}

	async getVideosById(id: Array<Number>) {
		if (!this.db) return [];
		if (!this.db.collections.videos) return [];

		const doc = await this.db.collections.videos
			.find()
			.where('video_id')
			.in(id)
			.exec();

		const result : VideoDAO[] = [];
		for (let i = 0; i < doc.length; i++) {
			result.push({
				id: doc[i].get('video_id'),
				name: doc[i].get('video_name'),
			});
		}

		return result;
	}

	async getVideosByOffset(offset : number, limit : number) {
		if (!this.db) return [];
		if (!this.db.collections.videos) return [];

		const doc = await this.db.collections.videos
			.find()
			.skip(offset)
			.limit(limit)
			.exec();

		const result : VideoDAO[] = [];
		for (let i = 0; i < doc.length; i++) {
			result.push({
				id: doc[i].get('video_id'),
				name: doc[i].get('video_name'),
			});
		}

		return result;
	}

	async getAllVideosAsArray() {
		if (!this.db) return [];
		if (!this.db.collections.videos) return [];

		const doc = await this.db.collections.videos
			.find()
			.exec();

		const result : VideoDAO[] = [];
		for (let i = 0; i < doc.length; i++) {
			result.push({
				id: doc[i].get('video_id'),
				name: doc[i].get('video_name'),
			});
		}

		return result;
	}

	async getAllVideosAsObject() {
		if (!this.db) return { };
		if (!this.db.collections.videos) return { };

    	const doc = await this.db.collections.videos
    		.find()
    		.exec();

    	const result : {[key: string] : VideoDAO} = { };
    	for (let i = 0; i < doc.length; i++) {
    		result[doc[i].get('video_id')] = {
    			id: doc[i].get('video_id'),
    			name: doc[i].get('video_name'),
    		};
    	}

    	return result;
	}
}

export { VideoDTO };
