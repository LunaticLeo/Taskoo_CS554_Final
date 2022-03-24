const { validate } = require('uuid');

module.exports = {
	/**
	 * @description check the validation of _id
	 */
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

		if (!isType(param, 'string')) {
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
