const { tasks } = require('../config/mongoCollections');
const Task = require('../lib/Task');
const core = require('./core');

/**
 * create task
 * @param {Task} taskObj
 */
const createTask = async taskObj => {
	return await core.create(taskObj, 'task');
};

module.exports = {
	createTask
};
