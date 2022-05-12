const { DBCollection } = require('./Collection');
const { status, tasks } = require('../config/mongoCollections');
const dayjs = require('dayjs');
const Check = require('./Check');
const Bucket = require('./Bucket');

class Task extends DBCollection {
	name = '';
	description = '';
	project = '';
	members = [];
	createTime = dayjs().valueOf();
	dueTime = NaN;
	status = 'Pending';
	attachments = [];

	constructor(obj) {
		super(obj);
		obj?._id && delete obj._id;

		obj.members = (Array.isArray(obj.members) ? obj.members : [obj.members]).map(item => {
			try {
				return JSON.parse(item);
			} catch {
				return item;
			}
		});
		
		Object.keys(obj).forEach(key => (this[key] = obj[key]));
		this.dueTime = +this.dueTime;
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

	async updateStatus(bucketId, to) {
		Check._id(bucketId);
		Check.status(to);

		// check the peermission
		const statusCol = await status();
		const { prerequire } = await statusCol.findOne({ name: to }, { projection: { prerequire: 1 } });
		if (prerequire !== this.status) throw Error(`Changing status from ${this.status} to ${to} are not allowed`);

		// update status
		const taskCol = await tasks();
		const { modifiedCount } = await taskCol.updateOne({ _id: this._id }, { $set: { status: to } });
		if (!modifiedCount) throw Error('Update failed, please try again later');

		// update bucket
		Bucket.updateStatus(bucketId, 'tasks', this._id, this.status, to);
	}
}

module.exports = Task;
