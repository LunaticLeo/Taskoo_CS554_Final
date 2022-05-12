const static = require('./static');
const account = require('./account');
const project = require('./project');
const task = require('./task');
const organization = require('./organization');

// the whitelist routes
const whitelist = ['/account/signin', '/account/signup','/account/signout'];

module.exports = app => {
	app.use('*', (req, res, next) => {
		const { originalUrl } = req;
		// console.log(originalUrl)
		if (!whitelist.includes(originalUrl) && !req.session.accountInfo) {
			return res.status(401).json({ code: 401, message: 'Unauthorized request' });
			// return res.redirect("/account/signin");
			// res.redirect("/account/signin");
		}
		next();
	});

	app.use('/static', static);
	app.use('/account', account);
	app.use('/project', project);
	app.use('/task', task);
	app.use('/org', organization);

	app.use('*', (_, res) => {
		res.status(404).json({ error: 'API not Found!' });
	});
};
