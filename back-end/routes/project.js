const router = require('express').Router();
const {
	createProject,
	projectStatistic,
	getProjectList,
	getDetails,
	getFavoriteStatus,
	getFavoriteList,
	addToFavorite,
	removeFromFavorite,
	getTasks,
	uploadAttachments,
	getAttachments
} = require('../data/project');
const { Project, Check } = require('../lib');

router.post('/create', async (req, res) => {
	const { _id } = req.session.accountInfo;

	req.body.members.unshift({ _id, role: { _id: '584b21b7-57b5-4394-825c-f488c53c7d51', name: 'Manager' } });
	let newProject;
	try {
		newProject = new Project(req.body);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const message = await createProject(newProject);
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
		const data = await getProjectList(bucket);
		res.status(200).json({ code: 200, message: '', data });
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

router.get('/favorite/status', async (req, res) => {
	const { bucket } = req.session.accountInfo;
	const { id: projectId } = req.query;

	try {
		Check._id(projectId);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const status = await getFavoriteStatus(bucket, projectId);
		res.json({ code: 200, message: '', data: status });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/favorite/list', async (req, res) => {
	const { bucket } = req.session.accountInfo;

	try {
		const favoriteList = await getFavoriteList(bucket);
		res.json({ code: 200, message: '', data: favoriteList });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.post('/favorite/add', async (req, res) => {
	const { bucket } = req.session.accountInfo;
	const { id: projectId } = req.body;

	try {
		Check._id(projectId);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const message = await addToFavorite(bucket, projectId);
		res.json({ code: 200, message });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.delete('/favorite/remove', async (req, res) => {
	const { bucket } = req.session.accountInfo;
	const { id: projectId } = req.body;

	try {
		Check._id(projectId);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const message = await removeFromFavorite(bucket, projectId);
		res.json({ code: 200, message });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/tasks', async (req, res) => {
	const { id } = req.query;

	try {
		Check._id(id);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const tasks = await getTasks(id);
		res.json({ code: 200, message: '', data: tasks });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.post('/attachments', async (req, res) => {
	const { id } = req.body;

	try {
		Check._id(id);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const message = await uploadAttachments(id, req.files);
		res.json({ code: 200, message });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/attachments/list', async (req, res) => {
	const { id } = req.query;

	try {
		Check._id(id);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const attachments = await getAttachments(id);
		res.json({ code: 200, message: '', data: attachments });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

module.exports = router;
