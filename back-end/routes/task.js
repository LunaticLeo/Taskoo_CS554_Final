const router = require('express').Router();
const { createTask } = require('../data/task');
const Task = require('../lib/Task');

router.post('/create', async (req, res) => {
	let newTask;
	try {
		newTask = new Task(req.body);
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

module.exports = router;
