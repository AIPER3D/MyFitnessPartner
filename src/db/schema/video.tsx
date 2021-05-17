/* eslint-disable camelcase */

const VideoSchema = {
	'title': 'Video',
	'version': 0,
	'type': 'object',
	'properties': {
		'video_id': {
			'type': 'number',
		},
		'video_name': {
			'type': 'string',
		},
		'video_thumbnail': {
			'type': 'string',
		},
		'video_timeline': {
			'type': 'array',
			'items': {
				'type': 'object',
				'properties': {
					'name': {
						'type': 'string',
					},
					'start': {
						'type': 'number',
					},
					'end': {
						'type': 'number',
					},
				},
			},
		},
	},
};

/* eslint-disable camelcase */

export { VideoSchema };
