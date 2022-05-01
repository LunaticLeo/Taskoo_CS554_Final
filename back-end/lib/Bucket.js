const Check = require('./Check');
const { DBCollection } = require('./Collection');
const { buckets, status } = require('../config/mongoCollections');

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
	favorites = [];

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
				throw Error(`${key} is ${this[key]}`);
			}

			Check.owner(this.owner);
			Object.values(this.projects).forEach(ids => ids.forEach(item => Check._id(item)));
			Object.values(this.tasks).forEach(ids => ids.forEach(item => Check._id(item)));
		}
	}

	/**
	 * update the status
	 * @param {string} bucketId
	 * @param {object} category 'projects' | 'tasks'
	 * @param {string} id project id | task id
	 * @param {null | string} from source status
	 * @param {string} to next status
	 */
	static async updateStatus(bucketId, category, id, from, to) {
		Check._id(bucketId);
		if (!['projects', 'tasks'].includes(category)) throw Error('Invalid category');
		Check.status(from, true);
		Check.status(to);

		// check the peermission
		const statusCol = await status();
		const { prerequire } = await statusCol.findOne({ name: to }, { projection: { prerequire: 1 } });
		if (prerequire !== from) throw Error(`Changing status from ${from} to ${to} are not allowed`);

		const bucketCol = await buckets();
		category = category.toLowerCase();
		from && (await bucketCol.updateOne({ _id: bucketId }, { $pull: { [`${category}.${from.toLowerCase()}`]: id } }));
		await bucketCol.updateOne({ _id: bucketId }, { $addToSet: { [`${category}.${to.toLowerCase()}`]: id } });
	}
	/**
	 * update the status
	 * @param {string} bucketId
	 * @param {object} category 'projects' | 'tasks'
	 * @param {string} id project id | task id
	 * @param {string} status source status
	 */
	static async deleteObj(bucketId, category, id,status) {
		Check._id(bucketId);
		if (!['projects', 'tasks'].includes(category)) throw Error('Invalid category');

		const bucketCol = await buckets();
		category = category.toLowerCase();
		await bucketCol.updateOne({ _id: bucketId }, { $pull: { [`${category}.${status.toLowerCase()}`]: id } });
	}
}

module.exports = Bucket;
