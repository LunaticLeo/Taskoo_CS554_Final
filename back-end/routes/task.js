const router = require('express').Router();
const { createTask, getTaskList, uploadAttachments, deleteTask, getStatusStatistic, updateTaskStatus } = require('../data/task');
const { Check } = require('../lib');
const { toCapitalize } = require('../utils/helpers');
const Task = require('../lib/Task');
const { updateStatus } = require('../lib/Bucket');

router.post('/create', async (req, res) => {
	let newTask;
	// console.log(req.body);
	try {
		newTask = new Task(req.body);
		// console.log(newTask);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const message = await createTask(newTask);
		res.json({ code: 200, message });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.post('/updateTaskStatus', async (req, res) => {
	const taskId = req.body['taskId'];
	const preStatus = toCapitalize(req.body['preStatus']);
	const destStatus = toCapitalize(req.body['destStatus']);
	// console.log(taskId, preStatus, destStatus)

	try {
		Check._id(taskId);
		Check.status(preStatus);
		Check.status(destStatus);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const message = await updateTaskStatus(req.session.accountInfo.bucket, taskId, preStatus, destStatus);
		res.json({ code: 200, message });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/list', async (req, res) => {
	const { bucket } = req.session.accountInfo;
	const { pageNum, pageSize } = req.query;

	try {
		const data = await getTaskList(bucket, { pageNum, pageSize });
		res.status(200).json({ code: 200, message: '', data });
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

router.get('/todo', async (req, res) => {
	const { bucket } = req.session.accountInfo;
	const { pageNum, pageSize } = req.query;

	try {
		let data = await getTaskList(bucket, { pageNum, pageSize });
		const list = data.list.map(x => {
			if (x.status !== 'done') {
				return x;
			}
		});

		data.list = list;

		res.status(200).json({ code: 200, message: '', data });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/status/statistic', async (req, res) => {
	const { bucket } = req.session.accountInfo;

	try {
		const data = await getStatusStatistic(bucket);
		res.status(200).json({ code: 200, message: '', data: data });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.delete('/remove', async (req, res) => {
	const { id: taskId } = req.body;

	try {
		Check._id(taskId);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const message = await deleteTask(taskId);
		res.json({ code: 200, message });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

module.exports = router;
