/**
 * The functions in this module is used fot projects and tasks
 * It contains common functions which are suit for both projects and tasks
 */
const { projects, tasks, accounts, buckets } = require('../config/mongoCollections');
const { Project, Task, Bucket } = require('../lib');
const { toCapitalize } = require('../utils/helpers');

/**
 * create function
 * @param {Project | Task} obj
 * @param {string} category project | task
 */
const create = async (obj, category, cb) => {
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

	cb && (await cb(insertedId));

	return `${toCapitalize(category)} ${newObj.name} create successfully`;
};

/**
 * get list data (project | task)
 * @param {string} category projects | tasks
 * @param {string} bucketId
 * @param {object} projection
 */
const getListFromBucket = async (category, bucketId, projection) => {
	const bucketsCol = await buckets();
	const data = await bucketsCol
		.aggregate([
			{
				$match: { _id: bucketId }
			},
			{
				$project: {
					list: {
						$concatArrays: [
							`$${category}.pending`,
							`$${category}.processing`,
							`$${category}.testing`,
							`$${category}.done`
						]
					},
					_id: 0
				}
			},
			{
				$lookup: {
					from: category,
					localField: 'list',
					foreignField: '_id',
					as: 'list'
				}
			},
			{
				$unwind: '$list'
			},
			{
				$replaceRoot: {
					newRoot: '$list'
				}
			},
			{
				$lookup: {
					from: 'accounts',
					localField: 'members._id',
					foreignField: '_id',
					pipeline: [{ $project: { disabled: 0, password: 0, bucket: 0 } }],
					as: 'members'
				}
			},
			{
				$project: projection
			}
		])
		.toArray();
	return data;
};

module.exports = {
	create,
	getListFromBucket
};
