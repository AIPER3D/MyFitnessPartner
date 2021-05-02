/* eslint-disable camelcase */

const UserSchema = {
	'title': 'User',
	'version': 0,
	'type': 'object',
	'properties': {
		'id': {
			'type': 'number',
		},
		'name': {
			'type': 'string',
		},
		'height': {
			'type': 'number',
		},
		'weight': {
			'type': 'number',
		},
	},
};

/* eslint-disable camelcase */

export { UserSchema };
