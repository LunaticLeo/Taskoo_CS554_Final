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

		try {
			obj.members = obj.members.map(item => JSON.parse(item));
		} catch (error) {}

		Object.keys(obj).forEach(key => (this[key] = obj[key]));
		this.checkValidation();
	}

	checkValidation() {
		Check.name(this.name);
		Check._id(this.manager._id);
		for (const member of this.members) {
			Check._id(member._id);
		}
		Check.status(this.status);
	}
}

module.exports = Project;
