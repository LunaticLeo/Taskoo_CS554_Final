const { getTasks, getDetails, getStatus } = require("../data/project");

const constructorMethod = (io) => {

    io.on('connection', (socket) => {

        socket.on('join', async (msg) => {
            // console.log("join", msg);
        });
        socket.on('viewProject', async (msg) => {
            // console.log("viewProject", msg, socket.id);
            socket.join(msg.projectId);
            const data = await getTasks(msg.projectId);
            socket.emit("tasks", data);
            // const status = await getStatus(msg.projectId);
            // socket.emit('projectStatus', status);
        })
        socket.on('updataTasks', async (msg) => {
            // console.log(msg, socket.id)
            const data = await getTasks(msg.projectId);
            io.to(msg.projectId).emit("tasks", data);
            const status = await getStatus(msg.projectId);
            io.to(msg.projectId).emit("projectStatus", status);
        });
        socket.on('disconnect', (msg) => {
            // console.log("disconnect", msg);
        });
    });

};

module.exports = constructorMethod;