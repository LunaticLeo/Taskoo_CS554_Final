/**
 * The functions in this module is used fot projects and tasks
 * It contains common functions which are suit for both projects and tasks
 */
const { projects, tasks, accounts } = require('../config/mongoCollections');
const { Project, Task, Bucket } = require('../lib');
const { toCapitalize } = require('../utils/helpers');

/**
 * create function
 * @param {Project | Task} obj
 * @param {string} category project | task
 */
const create = async (obj, category) => {
	if (!['project', 'task'].includes(category)) throw Error('category is invalid');

	let newObj;
	let collection;
	if (category === 'project') {
		newObj = new Project(obj);
		collection = await projects();
	} else {
		newObj = new Task(obj);
		collection = await tasks();
	}

	const { insertedId } = await collection.insertOne(newObj);

	// update bucket for members
	const accountsCol = await accounts();
	const memberId = newObj.members.map(item => item._id);
	const bucketIds = await accountsCol.find({ _id: { $in: memberId } }, { projection: { _id: 0, bucket: 1 } }).toArray();
	const updateFunc = bucketIds.map(
		async item => await Bucket.updateStatus(item.bucket, category + 's', insertedId, null, newObj.status)
	);
	await Promise.all(updateFunc);

	return `${toCapitalize(category)} ${newObj.name} create successfully`;
};

module.exports = {
	create
};
