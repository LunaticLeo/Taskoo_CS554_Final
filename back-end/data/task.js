const { tasks, projects } = require('../config/mongoCollections');
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
};

/**
 * get task list from bucket
 * @param {string} bucketId
 */
const getTaskList = async bucketId => {
	return await core.getListFromBucket('tasks', bucketId, { description: 0, attachments: 0 });
};

module.exports = {
	createTask,
	getTaskList
};
