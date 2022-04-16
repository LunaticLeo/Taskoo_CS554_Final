const static = require('./static');
const account = require('./account');
const project = require('./project');

// the whitelist routes
const whitelist = ['/account/signin', '/account/signup'];

module.exports = app => {
	app.post('*', (req, res, next) => {
		const { originalUrl } = req;
		if (!whitelist.includes(originalUrl) && !req.session.accountInfo) {
			return res.status(401).json({ code: 401, message: 'Unauthorized request' });
		}
		next();
	});

	app.use('/static', static);
	app.use('/account', account);
	app.use('/project', project);

	app.use('*', (_, res) => {
		res.status(404).json({ error: 'API not Found!' });
	});
};
