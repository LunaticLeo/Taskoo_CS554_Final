const { DBCollection } = require('./Collection');
const dayjs = require('dayjs');
const Check = require('./Check');

class Project extends DBCollection {
	name = '';
	description = '';
	createTime = dayjs().valueOf();
	members = [];
	status = 'Pending';
	tasks = [];
	attachments = [];

	constructor(obj) {
		super(obj);
		obj?._id && delete obj._id;

		obj.members = obj.members.map(item => {
			try {
				return JSON.parse(item);
			} catch {
				return item;
			}
		});

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
