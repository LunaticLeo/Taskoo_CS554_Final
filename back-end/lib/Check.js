const { validate } = require('uuid');
const { Status } = require('./Collection');

module.exports = {
	_id(param) {
		if (!validate(param)) {
			throw Error(`_id: ${param} is not valid`);
		}
		return param;
	},

	name(param) {
		if (param === null || param === undefined) {
			throw Error('name is not provided');
		}

		if (!isType(param, 'string') || param.trim() === '') {
			throw Error(`name: ${param} is not valid`);
		}
		return param;
	},

	level(param) {
		if (param === null || param === undefined) {
			throw Error('level is not provided');
		}

		if (!isType(param, 'number') || isNaN(param)) {
			throw Error(`level: ${param} is not valid`);
		}
		return param;
	},

	manager(param) {
		if (param === null || param === undefined) {
			throw Error('manager is not provided');
		}

		if (!validate(param)) {
			throw Error(`manager id: ${param} is not valid`);
		}
		return param;
	},

	bucket(param) {
		if (!validate(param)) {
			throw Error(`bucket id: ${param} is not valid`);
		}
		return param;
	},

	owner(param) {
		if (!validate(param)) {
			throw Error(`the id of owner: ${param} is not valid`);
		}
		return param;
	},

	firstName(param) {
		return this.name(param);
	},

	lastName(param) {
		return this.name(param);
	},

	// TODO
	email(param) {
		return param;
	},

	department(param) {
		if (!validate(param)) {
			throw Error(`the id of department: ${param} is not valid`);
		}
		return param;
	},

	position(param) {
		if (!validate(param)) {
			throw Error(`the id of position: ${param} is not valid`);
		}
		return param;
	},

	status(param) {
		if (param === null || param === undefined) {
			throw Error('status is not provided');
		}

		if (!isType(param, 'string') || param.trim() === '' || !Status.includes(param)) {
			throw Error(`status: ${param} is not valid`);
		}

		return param;
	}
};

/**
 * Check the parameter is the type of [type]
 * @param {string} type The type in JavaScript
 * 	number | string | boolean | object ({}) | array ([])
 * @returns {boolean}
 */
const isType = (param, type) => {
	if (type === 'object' || type === 'array') {
		if (typeof param === 'object') {
			if (type === 'array') {
				return Array.isArray(param);
			} else {
				return true;
			}
		} else {
			return false;
		}
	} else {
		return typeof param === type;
	}
};
