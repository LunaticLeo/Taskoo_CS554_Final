/**
 * format the string to capitalize
 * e.g. abc -> Abc
 */
const toCapitalize = str => {
	return str?.toLowerCase().replace(/^./, l => l.toUpperCase());
};

/**
 * composed name
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string} '{firstName} {lastName}'
 */
const getFullName = (firstName, lastName) => {
	return `${toCapitalize(firstName)} ${toCapitalize(lastName)}`;
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

module.exports = {
	toCapitalize,
	isType,
	getFullName
};
