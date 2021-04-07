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

	async addVideo(data : VideoDAO) {
		if (!this.db) return false;
		if (!this.db.collections.videos) return false;

		await this. db.collections.videos.insert({
			video_id: data['videoId'],
			video_name: data['videoName'],
		});

		return true;
	}

	async getCount() {
		if (!this.db) return 0;
		if (!this.db.collections.videos) return 0;

		const doc = await this.db.collections.videos
			.find()
			.exec();

		return doc.length;
	}

	getVideo(id : number) {
    	return { };
	}

	async getAllVideos() {
		if (!this.db) return { };
		if (!this.db.collections.videos) return { };

    	const doc = await this.db.collections.videos
    		.find()
    		.exec();

    	const result : {[key: string] : VideoDAO} = { };
    	for (let i = 0; i < doc.length; i++) {
    		result[doc[i].get('video_id')] = {
    			videoId: doc[i].get('video_id'),
    			videoName: doc[i].get('video_name'),
    			thumbnail: doc[i].get('video_thumbnail'),
    		};
    	}

    	return result;
	}
}

export { VideoDTO };
