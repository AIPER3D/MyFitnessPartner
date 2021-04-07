/* eslint-disable camelcase */

const ExerciseSchema = {
	'title': 'Exercise',
	'version': 0,
	'type': 'object',
	'properties': {
		'exercise_id': {
			'type': 'number',
		},
		'exercise_name': {
			'type': 'string',
		},
		'check_time': {
			'type': 'array',
			'items': {
				'type': 'object',
				'properties': {
					'time': {
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

export { ExerciseSchema };
