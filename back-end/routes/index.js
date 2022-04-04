const file = require('./file');
const static =require('./static');

module.exports = app => {
	app.use('/file', file);
	app.use('/static',static);
	app.use('*', (_, res) => {
		res.status(404).json({ error: 'API not Found!' });
	});
};
