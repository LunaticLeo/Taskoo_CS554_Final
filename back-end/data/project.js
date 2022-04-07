const { Project, Bucket } = require('../lib');
const { project } = require('../config/mongoCollections');

/**
 * create project
 * @param {Project} projectObj
 */
const createProject = async (projectObj, bucketId) => {
	const newProject = new Project(projectObj);

	const peojectCol = await project();
	const { insertedId } = await peojectCol.insertOne(newProject);

	// update bucket
	await Bucket.updateStatus(bucketId, 'projects', newProject._id, null, newProject.status);

	return `Project ${newProject.name} (id: ${insertedId}) create successfully`;
};

module.exports = {
	createProject
};
