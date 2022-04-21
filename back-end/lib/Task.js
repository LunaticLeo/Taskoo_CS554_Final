const { DBCollection } = require('./Collection');
const dayjs = require('dayjs');
const Check = require('./Check');

class Task extends DBCollection {
	name = '';
	description = '';
	project = '';
	members = [];
	createTime = dayjs().valueOf();
	dueTime = '';
	status = 'Pending';
	attachments = [];

	constructor(obj) {
		super(obj);
		obj?._id && delete obj._id;

		try {
			obj.members = obj.members.map(item => (isType(item, 'string') ? JSON.parse(item) : item));
		} catch (error) {}

		Object.keys(obj).forEach(key => (this[key] = obj[key]));
		this.checkValidation();
	}

	checkValidation() {
		Check.name(this.name);
		Check._id(this.project);
		for (const member of this.members) {
			Check._id(member._id);
			Check._id(member.role._id);
		}
		Check.status(this.status);
	}
}

module.exports = Task;
