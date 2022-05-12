const { getTasks, getDetails } = require("../data/project");

const constructorMethod = (io) => {

    const accountSockets = {};

    io.on('connection', (socket) => {
        let accountId;
        socket.on('join', async (msg) => {
            accountId = msg.accountId;
            accountSockets[msg.accountId] = accountSockets[msg.accountId] ?? new Set();
            accountSockets[msg.accountId].add(socket.id);

            const data = await getTasks(msg.projectId);
            socket.emit("tasks", { "projectId": msg.projectId, "tasks": data });
        });
        socket.on('queryTasks', async (msg) => {
            const data = await getTasks(msg.projectId);
            // socket.emit("tasks", data);
            const proDate = await getDetails(msg.projectId);
            membersInform = proDate.members.map(item => item._id);
            membersInform.forEach(element => {
                if (accountSockets[element]) {
                    accountSockets[element].forEach(element2 => {
                        io.to(element2).emit("tasks", { "projectId": msg.projectId, "tasks": data });
                    });
                }
            });
        });
        socket.on('disconnect', (msg) => {
            accountId && accountSockets[accountId].delete(socket.id);
            // console.log(accountSockets);
        });
    });

};

module.exports = constructorMethod;