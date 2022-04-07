const account = require('./account');
const file = require('./file');
const static = require('./static');

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

	app.use('/account', account);
	app.use('/file', file);
	app.use('/static', static);

	app.use('*', (_, res) => {
		res.status(404).json({ error: 'API not Found!' });
	});
};
