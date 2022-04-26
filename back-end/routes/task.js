const router = require('express').Router();
const { createTask, getTaskList } = require('../data/task');
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

router.get('/list', async (req, res) => {
	const { bucket } = req.session.accountInfo;

	try {
		const data = await getTaskList(bucket);
		res.status(200).json({ code: 200, message: '', data });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/todo', async (req, res) => {
	const { bucket } = req.session.accountInfo;

	try {
		const data = await getTaskList(bucket);
		const todoList= data.map((x)=>{
			if(x.status!=="done"){
				return x;
			}
		})
		res.status(200).json({ code: 200, message: '', todoList });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

// router.patch('/todo', async (req, res) => {
// 	const { bucket } = req.session.accountInfo;

// 	try {
// 		const data = await getTaskList(bucket);
// 		const todoList= data.map((x)=>{
// 			if(x.status!=="done"){
// 				return x;
// 			}
// 		})
// 		res.status(200).json({ code: 200, message: '', todoList });
// 	} catch (error) {
// 		return res.status(500).json({ code: 500, message: error?.message ?? error });
// 	}
// });

module.exports = router;
