/* eslint-disable camelcase */

const UserSchema = {
	'title': 'User',
	'version': 0,
	'type': 'object',
	'properties': {
		'user_id': {
			'type': 'number',
		},
		'user_name': {
			'type': 'string',
		},
		'user_gender': {
			'type': 'string',
		},
		'user_age': {
			'type': 'number',
		},
		'user_height': {
			'type': 'number',
		},
		'user_weight': {
			'type': 'number',
		},
	},
};

/* eslint-disable camelcase */

export { UserSchema };
