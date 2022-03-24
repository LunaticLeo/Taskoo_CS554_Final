const { DBCollection } = require('./Collection');

// TODO
class Account extends DBCollection {
	constructor(obj) {
		super(obj);
	}
}

module.exports = Account;
