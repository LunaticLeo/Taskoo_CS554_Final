const { DBCollection } = require('./Collection');
const dayjs = require('dayjs');
const Check = require('./Check');

class Project extends DBCollection {
	name = null;
	description = null;
	manager = null;
	createTime = dayjs().valueOf();
	members = [];
	status = 'Pending';
	tasks = [];
	attachments = [];

	constructor(obj) {
		super(obj);
		obj?._id && delete obj._id;

		Object.keys(obj).forEach(key => (this[key] = obj[key]));
		this.checkValidation();
	}

	checkValidation() {
		Check.name(this.name);
		Check._id(this.manager);
		for (const member of this.members) {
			Check._id(member);
		}
		Check.status(this.status);
	}
}

module.exports = Project;
