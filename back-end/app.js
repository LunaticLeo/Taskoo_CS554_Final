const express = require('express');
const session = require('express-session');
const app = express();
const configRoutes = require('./routes');
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
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
	console.log('Your routes will be running on http://localhost:4000');
});
