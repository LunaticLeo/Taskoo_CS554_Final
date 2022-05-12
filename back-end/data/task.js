const { tasks, projects } = require('../config/mongoCollections');
const { Check } = require('../lib');
const Task = require('../lib/Task');
const core = require('./core');
const dayjs = require('dayjs');

/**
 * create task
 * @param {Task} taskObj
 */
const createTask = async taskObj => {
	return await core.create(taskObj, 'task', async insertedId => {
		const projectCol = await projects();
		let { modifiedCount } = await projectCol.updateOne(
			{ _id: taskObj.project },
			{ $addToSet: { tasks: insertedId } }
		);
		if (!modifiedCount) throw Error('The task is already in task list');
		const project=await projectCol.findOne({_id:taskObj.project})
		if(project.status==="Pending") modifiedCount=await projectCol.updateOne(
			{_id:taskObj.project},
			{$set:{"status": "Processing"}}
		)
		//if (!modifiedCount) throw Error('The task is already in task list');
	});

	// TODO update project status from Pending to Processing
};

/**
 * update task status
 * @param {taskId, preStatus, destStatus} 
 */
const updateTaskStatus = async (bucketId, taskId, preStatus, destStatus) => {
	const taskCol = await tasks();
	const taskObj = new Task(await taskCol.findOne({ _id: taskId }));	

	taskObj.updateStatus(bucketId, destStatus);

	const projectId = taskObj.project;
	if (preStatus === "Processing" && destStatus === "Testing") {
		const projectCol = await projects();
		const { modifiedCount } = await projectCol.updateOne({ _id: projectId }, { $set: { "status": "Testing" } });
		// if (!modifiedCount) throw Error('The project is not exists');  // not required to check
	}

	return `Set task ${taskObj.name} as ${destStatus}`;
};

/**
 * delete task
 * @param {string} objid
 */
const deleteTask = async objid => {
	return await core.deleteobj(objid, 'task', async deleteobj => {
		const projectCol = await projects();
		const { modifiedCount } = await projectCol.updateOne({ _id: deleteobj.project }, { $pull: { tasks: objid } });
		if (!modifiedCount) throw Error('The task is not exists');
	});
};

/**
 * get task list from bucket
 * @param {string} bucketId
 * @param {object} pageConfig {pageNum: number, pageSize: number}
 */
const getTaskList = async (bucketId, pageConfig) => {
	return await core.getListFromBucket('tasks', bucketId, pageConfig, { attachments: 0 });
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

/**
 * get project statistic data by status
 * @param {string} bucketId
 */
const getStatusStatistic = async bucketId => {
	return await core.getStatusStatistic('tasks', bucketId);
};

module.exports = {
	createTask,
	getTaskList,
	deleteTask,
	uploadAttachments,
	getStatusStatistic,
	updateTaskStatus
};
