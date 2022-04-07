const { Project } = require('../lib');
const { project } = require('../config/mongoCollections');

/**
 * create project
 * @param {Project} projectObj
 */
const createProject = async projectObj => {
	const newProject = new Project(projectObj);

	const collection = await project();
	const { insertedId } = await collection.insertOne(newProject);
	return `Project ${newProject.name} (id: ${insertedId}) create successfully`;
};

module.exports = {
	createProject
};
