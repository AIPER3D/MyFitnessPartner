/* eslint-disable camelcase */

const RecordSchema = {
	'title': 'Record',
	'version': 0,
	'type': 'object',
	'properties': {
		'record_id': {
			'type': 'number',
		},
		'created_time': {
			'type': 'string',
		},
		'exercise': {
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
		'check_seq': {
			'type': 'array',
			'items': {
				'type': 'object',
				'properties': {
					'seq': {
						'type': 'number',
					},
				},
			},
		},
	},
};

/* eslint-disable camelcase */

export { RecordSchema };
