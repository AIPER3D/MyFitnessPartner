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
			video_timeline: data['timeline'],
		});

		return true;
	}

	async getVideoById(id: number) {
		if (!this.db) return null;
		if (!this.db.collections.videos) return null;

		const doc = await this.db.collections.videos
			.find()
			.where('video_id')
			.eq(id)
			.exec();

		if (doc.length <= 0) return null;

		const result : VideoDAO = {
			id: doc[0].get('video_id'),
			name: doc[0].get('video_name'),
			timeline: doc[0].get('video_timeline'),
		};

		return result;
	}

	async getVideosById(id: Array<Number>) {
		if (!this.db) return { };
		if (!this.db.collections.videos) return { };

		const doc = await this.db.collections.videos
			.find()
			.where('video_id')
			.in(id)
			.exec();

		const result : any = { };
		for (let i = 0; i < doc.length; i++) {
			const video : VideoDAO = {
				id: doc[i].get('video_id'),
				name: doc[i].get('video_name'),
				timeline: doc[i].get('video_timeline'),
			};
			result[doc[i].get('video_id')] = video;
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
			.sort({ video_id: 'desc' })
			.exec();

		const result : VideoDAO[] = [];
		for (let i = 0; i < doc.length; i++) {
			result.push({
				id: doc[i].get('video_id'),
				name: doc[i].get('video_name'),
				timeline: doc[i].get('video_timeline'),
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
				timeline: doc[i].get('video_timeline'),
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
				timeline: doc[i].get('video_timeline'),
    		};
    	}

    	return result;
	}

	async updateVideo(data: VideoDAO) {
		if (!this.db) return false;
		if (!this.db.collections.videos) return false;

		const doc = await this.db.collections.videos
			.findOne()
			.where({
				video_id: data['id'],
			});
		console.log(doc);

		doc.update({ $set: {
			video_name: data['name'],
			video_timeline: data['timeline'],
		}});

		return true;
	}
}

export { VideoDTO };
