const { tasks, projects } = require('../config/mongoCollections');
const { Check } = require('../lib');
const Task = require('../lib/Task');
const core = require('./core');

/**
 * create task
 * @param {Task} taskObj
 */
const createTask = async taskObj => {
	return await core.create(taskObj, 'task', async insertedId => {
		const projectCol = await projects();
		const { modifiedCount } = await projectCol.updateOne(
			{ _id: taskObj.project },
			{ $addToSet: { tasks: insertedId } }
		);
		if (!modifiedCount) throw Error('The task is already in task list');
	});

	// TODO update project status from Pending to Processing
};

/**
 * get task list from bucket
 * @param {string} bucketId
 * @param {object} pageConfig {pageNum: number, pageSize: number}
 */
const getTaskList = async (bucketId, pageConfig) => {
	return await core.getListFromBucket('tasks', bucketId, pageConfig, { description: 0, attachments: 0 });
};

/**
 * upload attachments to task
 * @param {string} _id project id | task id
 * @param {File[]} files
 */
const uploadAttachments = async (_id, files) => {
	Check._id(_id);
	return await core.uploadAttachments('tasks', _id, files);
};

module.exports = {
	createTask,
	getTaskList,
	uploadAttachments
};
