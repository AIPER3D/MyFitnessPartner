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
		'routine_videos': {
			'type': 'array',
			'items': {
				'type': 'number',
			},
		},
	},
	'indexes': ['routine_id'],
};

/* eslint-disable camelcase */

export { RoutineSchema };
