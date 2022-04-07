const { createProject } = require('../data/project');
const { Project } = require('../lib');

const router = require('express').Router();

router.post('/create', async (req, res) => {
	let newProject;
	try {
		newProject = new Project({ ...req.body, manager: req.session.accountInfo._id });
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const message = await createProject(newProject);
		res.json({ code: 200, message });
	} catch (error) {
		res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

module.exports = router;
