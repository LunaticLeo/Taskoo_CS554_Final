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
};

/**
 * delete task
 * @param {string} objid
 */
 const deleteTask = async objid => {
	return await core.deleteobj(objid, 'task', async deleteobj => {
		const projectCol = await projects();
		const { modifiedCount } = await projectCol.updateOne(
			{ _id: deleteobj.project },
			{ $pull: { tasks: objid } }
		);
		if (!modifiedCount) throw Error('The task is not exists');
	});
};


/**
 * get task list from bucket
 * @param {string} bucketId
 */
const getTaskList = async bucketId => {
	return await core.getListFromBucket('tasks', bucketId, { description: 0, attachments: 0 });
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
	deleteTask,
	uploadAttachments
};
