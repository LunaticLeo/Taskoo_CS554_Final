const Check = require('./Check');
const { DBCollection } = require('./Collection');
const { bucket } = require('../config/mongoCollections');

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

	/**
	 * update the status
	 * @param {object} category 'projects' | 'tasks'
	 * @param {string} id
	 * @param {string} from previous status
	 * @param {string} to target status
	 */
	static async updateStatus(bucketId, category, id, from = null, to) {
		category = category.toLowerCase();
		const bucketCol = await bucket();
		const bucketInfo = await bucketCol.findOne({ _id: bucketId }, { projection: { [category]: 1 } });

		if (!to) return;

		if (!from) {
			bucketInfo[category].pending.push(id);
		} else {
			const index = bucketInfo[category][from].findIndex(item => item === id);
			bucketInfo[category][from].splice(index, 1);
			bucketInfo[category][to].push(id);
		}
		await bucketCol.updateOne({ _id: bucketId }, { $set: { [category]: bucketInfo[category] } });
	}
}

module.exports = Bucket;
