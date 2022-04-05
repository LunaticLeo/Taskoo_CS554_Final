/**
 * format the string to capitalize
 * e.g. abc -> Abc
 */
const toCapitalize = str => {
	return str?.toLowerCase().replace(/^./, l => l.toUpperCase());
};

module.exports = {
	toCapitalize
};
