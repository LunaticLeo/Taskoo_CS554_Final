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

const projectStatistic = async bucketId => {
	const bucketsCol = await buckets();
	const data = await bucketsCol.findOne(
		{ _id: bucketId },
		{
			projection: {
				_id: 0,
				pending: { $size: '$projects.pending' },
				processing: { $size: '$projects.processing' },
				testing: { $size: '$projects.testing' },
				done: { $size: '$projects.done' }
			}
		}
	);
	return data;
};

const projectList = async bucketId => {
	const bucketsCol = await buckets();
	const data = await bucketsCol
		.aggregate([
			{
				$match: {
					_id: bucketId
				}
			},
			{
				$project: {
					userProjects: {
						$concatArrays: ['$projects.pending', '$projects.processing', '$projects.testing', '$projects.done']
					},
					_id: 0
				}
			},
			{
				$lookup: {
					from: 'projects',
					localField: 'userProjects',
					foreignField: '_id',
					as: 'userProjects'
				}
			},
			{
				$unwind: '$userProjects'
			},
			{
				$replaceRoot: {
					newRoot: '$userProjects'
				}
			},
			{
				$lookup: {
					from: 'accounts',
					localField: 'members._id',
					foreignField: '_id',
					as: 'members'
				}
			},
			{
				$project: {
					'members.disabled': 0,
					'members.password': 0,
					'members.bucket': 0
				}
			}
		])
		.toArray();

	// console.dir(data, { depth: null });

	return data;
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
 * @returns {Promise<{_id: string, name: string}[]>}
 */
const getFavoriteList = async bucketId => {
	Check._id(bucketId);
	const bucketsCol = await buckets();
	const data = await bucketsCol
		.aggregate([
			{ $match: { _id: bucketId } },
			{ $project: { _id: 0, favorites: 1 } },
			{
				$lookup: {
					from: 'projects',
					localField: 'favorites',
					foreignField: '_id',
					as: 'favoriteList',
					pipeline: [{ $project: { description: 0, tasks: 0, attachments: 0 } }]
				}
			}
		])
		.toArray();

	return data[0].favoriteList;
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

module.exports = {
	createProject,
	projectStatistic,
	projectList,
	getDetails,
	getFavoriteStatus,
	getFavoriteList,
	addToFavorite,
	removeFromFavorite
};
