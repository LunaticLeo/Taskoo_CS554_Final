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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable('x-powered-by');
app.use(multerMid.single('file'));
app.use(
	session({
		name: 'AuthCookie',
		secret: 'some secret string!',
		resave: false,
		saveUninitialized: false
	})
);

configRoutes(app);

app.listen(4000, () => {
	console.log('🚀 Server ready at http://localhost:4000 🚀');
});
