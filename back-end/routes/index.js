const account = require('./account');
const file = require('./file');

module.exports = app => {
	app.use('/account', account);
	app.use('/file', file);

	app.use('*', (_, res) => {
		res.status(404).json({ error: 'API not Found!' });
	});
};
