const { getTasks, getDetails, getStatus } = require('../data/project');

const constructorMethod = io => {
	io.on('connection', socket => {
		socket.on('viewProject', async msg => {
			socket.join(msg.projectId);
			const data = await getTasks(msg.projectId);
			socket.emit('tasks', data);
		});
		socket.on('updateTasks', async msg => {
			const data = await getTasks(msg.projectId);
			io.to(msg.projectId).emit('tasks', data);
			const status = await getStatus(msg.projectId);
			io.to(msg.projectId).emit('projectStatus', status);
		});
	});
};

module.exports = constructorMethod;
