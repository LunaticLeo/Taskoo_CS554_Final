const { Project, Check } = require('../lib');
const { projects, buckets } = require('../config/mongoCollections');
const core = require('./core');

/**
 * create project
 * @param {Project} projectObj
 */
const createProject = async projectObj => {
	return await core.create(projectObj, 'project');
};

/**
 * get project statistic data by status
 * @param {string} bucketId
 */
const getStatusStatistic = async bucketId => {
	Check._id(bucketId);
	return await core.getStatusStatistic('projects', bucketId);
};

/**
 * get task statistic data in projects
 */
const getTaskStatistic = async bucketId => {
	Check._id(bucketId);
	const bucketsCol = await buckets();
	const { projects, tasks } = (
		await bucketsCol
			.aggregate([
				{
					$match: { _id: bucketId }
				},
				{
					$project: {
						_id: 0,
						projects: {
							$concatArrays: ['$projects.pending', '$projects.processing', '$projects.testing', '$projects.done']
						}
					}
				},
				{
					$lookup: {
						from: 'projects',
						localField: 'projects',
						foreignField: '_id',
						as: 'projects',
						pipeline: [{ $project: { tasks: 1, name: 1 } }]
					}
				},
				{
					$lookup: {
						from: 'tasks',
						localField: 'projects.tasks',
						foreignField: '_id',
						as: 'tasks',
						pipeline: [{ $project: { status: 1, name: 1 } }]
					}
				}
			])
			.toArray()
	)[0];

	const data = projects.map(project => {
		const { _id, name, tasks: _tasks } = project;
		const statistic = _tasks.reduce(
			(pre, cur) => {
				const task = tasks.find(item => item._id === cur);
				pre[task.status.toLowerCase()]++;
				return pre;
			},
			{
				pending: 0,
				processing: 0,
				testing: 0,
				done: 0
			}
		);
		return { _id, name, statistic };
	});

	return data;
};

/**
 * get project list from bucket
 * @param {string} bucketId
 * @param {object} pageConfig {pageNum: number, pageSize: number}
 */
const getProjectList = async (bucketId, pageConfig) => {
	return await core.getListFromBucket('projects', bucketId, pageConfig, { description: 0, tasks: 0, attachments: 0 }, { $sort: { "list.createTime": -1 } });
};

/**
 * get the detail of the project
 * @param {string} _id project id
 * @returns {Promise<Project>}
 */
const getDetails = async _id => {
	Check._id(_id);
	const projectCol = await projects();
	const projectInfo = await projectCol
		.aggregate([
			{ $match: { _id } },
			{
				$lookup: {
					from: 'accounts',
					localField: 'members._id',
					foreignField: '_id',
					pipeline: [{ $project: { bucket: 0, password: 0, disabled: 0 } }],
					as: 'accounts'
				}
			},
			{
				$lookup: {
					from: 'departments',
					localField: 'accounts.department',
					foreignField: '_id',
					as: 'departments'
				}
			},
			{
				$lookup: {
					from: 'positions',
					localField: 'accounts.position',
					foreignField: '_id',
					pipeline: [{ $project: { level: 0 } }],
					as: 'positions'
				}
			},
			{
				$addFields: {
					members: {
						$map: {
							input: '$accounts',
							in: {
								$arrayToObject: {
									$concatArrays: [
										{ $objectToArray: '$$this' },
										{
											$objectToArray: {
												$arrayElemAt: ['$members', { $indexOfArray: ['$members._id', '$$this._id'] }]
											}
										},
										{
											$objectToArray: {
												department: {
													$arrayElemAt: ['$departments', { $indexOfArray: ['$departments._id', '$$this.department'] }]
												},
												position: {
													$arrayElemAt: ['$positions', { $indexOfArray: ['$positions._id', '$$this.position'] }]
												}
											}
										}
									]
								}
							}
						}
					}
				}
			},
			{ $project: { accounts: 0, departments: 0, positions: 0, tasks: 0 } }
		])
		.toArray();

	return projectInfo[0];
};

/**
 * get a project's favorite status
 * @param {string} bucketId
 * @param {string} projectId
 * @returns {Promise<boolean>}
 */
const getFavoriteStatus = async (bucketId, projectId) => {
	Check._id(bucketId);
	Check._id(projectId);
	const bucketsCol = await buckets();
	const data = await bucketsCol.findOne({ _id: bucketId, favorites: { $elemMatch: { $eq: projectId } } });

	return Boolean(data);
};

/**
 * get the favorite list
 * @param {string} bucketId
 * @param {object} pageConfig {pageNum: number, pageSize: number}
 * @returns {Promise<{_id: string, name: string}[]>}
 */
const getFavoriteList = async (bucketId, { pageNum = 1, pageSize = 10 }) => {
	Check._id(bucketId);
	const bucketsCol = await buckets();
	const list = await bucketsCol
		.aggregate([
			{ $match: { _id: bucketId } },
			{ $project: { _id: 0, favorites: 1 } },
			{
				$lookup: {
					from: 'projects',
					localField: 'favorites',
					foreignField: '_id',
					as: 'favorites',
					pipeline: [{ $project: { description: 0, tasks: 0, attachments: 0 } }]
				}
			},
			{ $unwind: '$favorites' },
			{ $replaceRoot: { newRoot: '$favorites' } },
			{ $skip: (+pageNum - 1) * +pageSize },
			{ $limit: +pageSize },
			{
				$lookup: {
					from: 'accounts',
					localField: 'members._id',
					foreignField: '_id',
					pipeline: [{ $project: { disabled: 0, password: 0, bucket: 0 } }],
					as: 'members'
				}
			}
		])
		.toArray();

	const { count } = await bucketsCol.findOne({ _id: bucketId }, { projection: { count: { $size: '$favorites' } } });

	return { count, list };
};

/**
 * add a project to facorite list
 * @param {string} bucketId
 * @param {string} projectId
 */
const addToFavorite = async (bucketId, projectId) => {
	Check._id(bucketId);
	Check._id(projectId);
	const bucketsCol = await buckets();
	const { modifiedCount } = await bucketsCol.updateOne({ _id: bucketId }, { $addToSet: { favorites: projectId } });
	if (!modifiedCount) throw Error('The project is already in favorite list');

	return 'Added to favorites';
};

/**
 * remove a project from favorite list
 * @param {string} bucketId
 * @param {string} projectId
 */
const removeFromFavorite = async (bucketId, projectId) => {
	Check._id(bucketId);
	Check._id(projectId);
	const bucketsCol = await buckets();
	const { modifiedCount } = await bucketsCol.updateOne({ _id: bucketId }, { $pull: { favorites: projectId } });
	if (!modifiedCount) throw Error('The project is not exist in favorite list');

	return 'Removed from favorites';
};

/**
 * get all tasks in specific project
 * @param {string} projectId
 */
const getTasks = async projectId => {
	Check._id(projectId);
	const projectCol = await projects();
	const data = await projectCol
		.aggregate([
			{
				$match: { _id: projectId }
			},
			{
				$project: { _id: 0, tasks: 1 }
			},
			{
				$lookup: {
					from: 'tasks',
					localField: 'tasks',
					foreignField: '_id',
					as: 'tasks'
				}
			},
			{ $unwind: '$tasks' },
			{
				$replaceRoot: { newRoot: '$tasks' }
			},
			{
				$lookup: {
					from: 'accounts',
					localField: 'members._id',
					foreignField: '_id',
					pipeline: [
						{
							$project: { bucket: 0, disabled: 0, password: 0, position: 0, department: 0 }
						}
					],
					as: 'membersRef'
				}
			},
			{
				$addFields: {
					members: {
						$map: {
							input: '$membersRef',
							in: {
								$arrayToObject: {
									$concatArrays: [
										{ $objectToArray: '$$this' },
										{
											$objectToArray: {
												$arrayElemAt: ['$members', { $indexOfArray: ['$members._id', '$$this._id'] }]
											}
										}
									]
								}
							}
						}
					}
				}
			},
			{
				$project: { membersRef: 0 }
			}
		])
		.toArray();

	const tasks = data.reduce(
		(pre, cur) => {
			const { status } = cur;
			pre[status.toLowerCase()].push(cur);

			return pre;
		},
		{
			pending: [],
			processing: [],
			testing: [],
			done: []
		}
	);

	for (const property in tasks) {
		tasks[property].sort((a, b) => a.dueTime - b.dueTime);
	}

	return tasks;
};

/**
 * upload attachments to project
 * @param {string} _id project id | task id
 * @param {File[]} files
 */
const uploadAttachments = async (_id, files) => {
	Check._id(_id);
	return await core.uploadAttachments('projects', _id, files);
};

/**
 * get attachments
 * @param {string} _id project id | task id
 */
const getAttachments = async _id => {
	return await core.getAttachments('projects', _id);
};

module.exports = {
	createProject,
	getStatusStatistic,
	getProjectList,
	getDetails,
	getFavoriteStatus,
	getFavoriteList,
	addToFavorite,
	removeFromFavorite,
	getTasks,
	uploadAttachments,
	getAttachments,
	getTaskStatistic
};
