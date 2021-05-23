/* eslint-disable camelcase */

const RecordSchema = {
	'title': 'Record',
	'version': 0,
	'type': 'object',
	'properties': {
		'record_id': {
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
					'exercise_name': {
						'type': 'string',
					},
					'exercise_start_time': {
						'type': 'number',
					},
					'exercise_end_time': {
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

export { RecordSchema };
