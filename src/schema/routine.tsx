/* eslint-disable camelcase */

const RoutineSchema = {
	'title': 'Routine',
	'version': 0,
	'type': 'object',
	'properties': {
		'routine_id': {
			'type': 'number',
		},
		'routine_name': {
			'type': 'string',
		},
		'videos': {
			'type': 'array',
			'items': {
				'type': 'object',
				'properties': {
					'video_id': {
						'type': 'number',
					},
					'video_count': {
						'type': 'number',
					},
				},
			},
		},
	},
};

/* eslint-disable camelcase */

export { RoutineSchema };
