const { Project, Bucket, Check } = require('../lib');
const { projects, buckets, accounts } = require('../config/mongoCollections');

/**
 * create project
 * @param {Project} projectObj
 */
const createProject = async (projectObj, bucketId) => {
	const newProject = new Project(projectObj);

	const projectCol = await projects();
	const { insertedId } = await projectCol.insertOne(newProject);

	// update bucket for manager
	await Bucket.updateStatus(bucketId, 'projects', insertedId, null, newProject.status);
	// update bucket for members
	const accountsCol = await accounts();
	const memberId = newProject.members.map(item => item._id);
	const bucketIds = await accountsCol.find({ _id: { $in: memberId } }, { projection: { _id: 0, bucket: 1 } }).toArray();
	const updateFunc = bucketIds.map(
		async item => await Bucket.updateStatus(item.bucket, 'projects', insertedId, null, newProject.status)
	);
	await Promise.all(updateFunc);

	return `Project ${newProject.name} create successfully`;
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
					as: 'userProjectsDetails'
				}
			}
		])
		.toArray();

	return data[0]['userProjectsDetails'];
};

/**
 * get the detail of the project
 * @param {string} _id project id
 * @returns {Promise<Project>}
 */
const getDetails = async _id => {
	Check._id(_id);
	const projectCol = await projects();
	const projectInfo = await projectCol.findOne({ _id });

	return projectInfo;
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
