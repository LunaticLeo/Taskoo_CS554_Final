const { Project, Bucket } = require('../lib');
const { projects, buckets } = require('../config/mongoCollections');

/**
 * create project
 * @param {Project} projectObj
 */
const createProject = async (projectObj, bucketId) => {
	const newProject = new Project(projectObj);

	const projectCol = await projects();
	const { insertedId } = await projectCol.insertOne(newProject);

	// update bucket
	await Bucket.updateStatus(bucketId, 'projects', newProject._id, null, newProject.status);

	return `Project ${newProject.name} (id: ${insertedId}) create successfully`;
};

const projectStatistic = async (bucket_id) => {
	const bucketsCol = await buckets();
	const data = await bucketsCol.findOne({ _id: bucket_id },
		{
			projection: {
				"pending": { $size: "$projects.pending" },
				"processing": { $size: "$projects.processing" },
				"testing": { $size: "$projects.testing" },
				"done": { $size: "$projects.done" },
			}

		});
	console.log(data)
	return data;
};

module.exports = {
	createProject,
	projectStatistic
};
