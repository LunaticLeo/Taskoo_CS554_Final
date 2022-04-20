const { DBCollection } = require('./Collection');
const dayjs = require('dayjs');
const Check = require('./Check');
const { isType } = require('../utils/helpers');

class Project extends DBCollection {
	name = null;
	description = null;
	createTime = dayjs().valueOf();
	members = [];
	status = 'Pending';
	tasks = [];
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
		for (const member of this.members) {
			Check._id(member._id);
			Check._id(member.role._id);
		}
		Check.status(this.status);
	}
}

module.exports = Project;
