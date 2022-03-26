const { v4: uuidv4 } = require('uuid');
const Check = require('./Check');

class DBCollection {
	constructor({ _id }) {
		this._id = _id ? Check._id(_id) : uuidv4();
	}
}

class DBStaticCollection extends DBCollection {
	constructor({ _id, name, ...rest }) {
		super({ _id });

		this.name = Check.name(name);
		Object.keys(rest).forEach(key => (this[key] = Check[key](rest[key])));
	}
}

module.exports = { DBCollection, DBStaticCollection };
