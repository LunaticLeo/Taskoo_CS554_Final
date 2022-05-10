// express
const express = require('express');
const session = require('express-session');
const app = express();
const configRoutes = require('./routes');
const multer = require('multer');

const multerMid = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024
	}
});

app.disable('x-powered-by');
app.use(multerMid.array('file'));
app.use(
	session({
		name: 'AuthCookie',
		secret: 'some secret string!',
		resave: false,
		saveUninitialized: false
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

// socket
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
	cors: {
		origin: "*"
	}
});
const configServer = require('./socket');
configServer(io);


server.listen(4000, () => {
	console.log("We've now got a server with socket!");
	console.log('Your routes will be running on http://localhost:4000');
});