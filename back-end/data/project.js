const { Project, Bucket } = require('../lib');
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
	await Bucket.updateStatus(bucketId, 'projects', newProject._id, null, newProject.status);
	// update bucket for members
	const accountsCol = await accounts();
	const memberId = newProject.members.map(item => item._id);
	const bucketIds = await accountsCol.find({ _id: { $in: memberId } }, { projection: { _id: 0, bucket: 1 } }).toArray();
	const updateFunc = bucketIds.map(
		async item => await Bucket.updateStatus(item.bucket, 'projects', newProject._id, null, newProject.status)
	);
	await Promise.all(updateFunc);

	return `Project ${newProject.name} (id: ${insertedId}) create successfully`;
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

const projectList = async bucket_id => {
	const bucketsCol = await buckets();
	const data = await bucketsCol.findOne(
		{ _id: bucket_id },
		{
			projection: {
				pending: { $size: '$projects.pending' },
				processing: { $size: '$projects.processing' },
				testing: { $size: '$projects.testing' },
				done: { $size: '$projects.done' }
			}
		}
	);
	console.log(data);
	return data;
};

module.exports = {
	createProject,
	projectStatistic,
	projectList
};
