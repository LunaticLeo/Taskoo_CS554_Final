const router = require('express').Router();
const {
	createProject,
	getStatusStatistic,
	getProjectList,
	getDetails,
	getFavoriteStatus,
	getFavoriteList,
	addToFavorite,
	removeFromFavorite,
	getTasks,
	uploadAttachments,
	getAttachments,
	getTaskStatistic
} = require('../data/project');
const { search } = require('../data/core');
const { Project, Check } = require('../lib');

router.post('/create', async (req, res) => {
	const { _id } = req.session.accountInfo;

	const { members } = req.body;

	req.body.members = members ? (Array.isArray(members) ? members : [members]) : [];
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

router.get('/status/statistic', async (req, res) => {
	const { bucket } = req.session.accountInfo;

	try {
		const data = await getStatusStatistic(bucket);
		res.status(200).json({ code: 200, message: '', data });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/task/statistic', async (req, res) => {
	const { bucket } = req.session.accountInfo;

	try {
		const data = await getTaskStatistic(bucket);
		res.status(200).json({ code: 200, message: '', data });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/list', async (req, res) => {
	const { bucket } = req.session.accountInfo;
	const { pageNum, pageSize } = req.query;

	try {
		const data = await getProjectList(bucket, { pageNum, pageSize });
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
	const { pageNum, pageSize } = req.query;

	try {
		const data = await getFavoriteList(bucket, { pageNum, pageSize });
		res.json({ code: 200, message: '', data });
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
	let pageNum, pageSize;
	if (req.query.pageNum) pageNum = req.query.pageNum;
	else pageNum = 1;
	if (req.query.pageSize) pageSize = req.query.pageSize;
	else pageSize = 10;
	try {
		Check._id(id);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const attachments = await getAttachments(id);
		const attachmentdata = attachments.slice((pageNum - 1) * pageSize, pageNum * pageSize);
		res.json({ code: 200, message: '', data: attachmentdata });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/search', async (req, res) => {
	const { _id } = req.session.accountInfo;

	try {
		const data = await search(req.query.searchTerm, _id);
		res.status(200).json({ code: 200, message: '', data });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

module.exports = router;
