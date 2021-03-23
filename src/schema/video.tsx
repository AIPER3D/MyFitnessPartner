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
		'timeline': {
			'type': 'array',
			'items': {
				'type': 'object',
				'properties': {
					'time_start': {
						'type': 'number',
					},
					'time_end': {
						'type': 'number',
					},
					'exercise_id': {
						'type': 'number',
					},
					'exercise_time': {
						'type': 'number',
					},
					'exercise_count': {
						'type': 'number',
					},
				},
			},
		},
	},
};

/* eslint-disable camelcase */

export { VideoSchema };
