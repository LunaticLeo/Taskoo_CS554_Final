const constructorMethod = (io) => {

    let accountList = {};

    io.on('connection', (socket) => {
        let account;
        socket.on('join', (msg) => {
            if (accountList[msg] == undefined) {
                accountList[msg] = []
            }
            accountList[msg].push(socket.id);
            account = msg;
        });
        socket.on('receive', (msg) => {
            if (accountList[msg.receiver] != undefined) {
                accountList[msg.receiver].forEach(element => {
                    io.to(element).emit("receive", msg);
                });
            }
        });
        socket.on('disconnect', () => {
            if (accountList != {}) {
                accountList[account].splice(accountList[account].indexOf(socket.id), 1);
            }
        });
    });

};

module.exports = constructorMethod;