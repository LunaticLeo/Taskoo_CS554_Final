const { Project } = require('../lib');
const { project, bucket } = require('../config/mongoCollections');

/**
 * create project
 * @param {Project} projectObj
 */
const createProject = async (projectObj, bucketId) => {
	const newProject = new Project(projectObj);

	const peojectCol = await project();
	const { insertedId } = await peojectCol.insertOne(newProject);

	// update bucket
	const bucketCol = await bucket();
	const { projects } = await bucketCol.findOne({ _id: bucketId }, { projection: { projects: 1 } });
	projects[newProject.status.toLowerCase()].push(newProject._id);
	await bucketCol.updateOne({ _id: bucketId }, { $set: { projects } });

	return `Project ${newProject.name} (id: ${insertedId}) create successfully`;
};

module.exports = {
	createProject
};
