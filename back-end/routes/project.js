const { createProject, projectStatistic, projectList, getDetails } = require('../data/project');
const { Project, Check } = require('../lib');
const { getFullName } = require('../utils/helpers');

const router = require('express').Router();

router.post('/create', async (req, res) => {
	const { _id, firstName, lastName, avatar, bucket } = req.session.accountInfo;
	const manager = { _id, fullName: getFullName(firstName, lastName), avatar, role: 'Manager' };

	let newProject;
	try {
		newProject = new Project({ ...req.body, manager });
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const message = await createProject(newProject, bucket);
		res.json({ code: 200, message });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/statistic', async (req, res) => {
	const { bucket } = req.session.accountInfo;

	try {
		const data = await projectStatistic(bucket);
		res.status(200).json({ code: 200, message: '', data: data });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/list', async (req, res) => {
	const { bucket } = req.session.accountInfo;

	try {
		const data = await projectList(bucket);
		res.status(200).json({ code: 200, message: '', data: data });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/detail', async (req, res) => {
	const { id } = req.query;

	try {
		Check._id(id);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const projectInfo = await getDetails(id);
		res.json({ code: 200, message: '', data: projectInfo });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

module.exports = router;
