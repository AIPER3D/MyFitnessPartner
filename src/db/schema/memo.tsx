/* eslint-disable camelcase */

const MemoSchema = {
	'title': 'Memo',
	'version': 0,
	'type': 'object',
	'properties': {
		'memo_id': {
			'type': 'number',
		},
		'memo_date': {
			'type': 'string',
		},
		'memo_type': {
			'type': 'string',
		},
		'memo_value': {
			'type': 'string',
		},
	},
};

/* eslint-disable camelcase */
export { MemoSchema };
