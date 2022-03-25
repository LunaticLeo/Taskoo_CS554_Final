const Check = require('./Check');
const { DBCollection } = require('./Collection');

class Bucket extends DBCollection {
	owner = null;
	projects = {
		pending: [],
		processing: [],
		testing: [],
		done: []
	};
	tasks = {
		pending: [],
		processing: [],
		testing: [],
		done: []
	};

	constructor(obj) {
		super(obj);
		obj?._id && delete obj._id;

		Object.keys(obj).forEach(key => (this[key] = obj[key]));
		this.checkValidation();
	}

	checkValidation() {
		const requiredFields = ['owner'];
		for (const key of requiredFields) {
			if (this[key] === null || this[key] === undefined) {
				throw new Error(`${key} is ${this[key]}`);
			}

			Check.owner(this.owner);
			Object.values(this.projects).forEach(ids => ids.forEach(item => Check._id(item)));
			Object.values(this.tasks).forEach(ids => ids.forEach(item => Check._id(item)));
		}
	}
}

module.exports = Bucket;
