const { v4: uuidv4, validate } = require('uuid');
const Check = require('./Check');

class DBCollection {
	constructor({ _id }) {
		if (!_id) {
			this._id = uuidv4();
		} else {
			if (!validate(_id)) throw Error(`_id: ${param} is not valid`);
			this._id = _id;
		}
	}
}

class DBStaticCollection extends DBCollection {
	constructor({ _id, name, ...rest }) {
		super({ _id });

		this.name = Check.name(name);
		Object.keys(rest).forEach(key => (this[key] = Check[key](rest[key])));
	}
}

const Status = ['Pending', 'Processing', 'Testing', 'Done'];

module.exports = { DBCollection, DBStaticCollection, Status };
