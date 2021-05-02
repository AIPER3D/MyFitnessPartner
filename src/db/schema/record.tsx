/* eslint-disable camelcase */

const RecordSchema = {
	'title': 'Record',
	'version': 0,
	'type': 'object',
	'properties': {
		'record_id': {
			'type': 'number',
		},
		'record_time': {
			'type': 'number',
		},
		'routine_id': {
			'type': 'number',
		},
		'routine_name': {
			'type': 'string',
		},
		'record_exercises': {
			'type': 'array',
			'items': {
				'type': 'object',
				'properties': {
					'exercise_id': {
						'type': 'number',
					},
					'exercise_value': {
						'type': 'number',
					},
				},
			},
		},
	},
};

/* eslint-disable camelcase */

export { RecordSchema };
