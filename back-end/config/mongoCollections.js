const dbConnection = require('./mongoConnection');

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = collection => {
	let _col = undefined;

	return async () => {
		if (!_col) {
			const db = await dbConnection();
			_col = await db.collection(collection);
		}

		return _col;
	};
};

module.exports = {
	departments: getCollectionFn('departments'),
	positions: getCollectionFn('positions'),
	roles: getCollectionFn('roles'),
	status: getCollectionFn('status'),
	accounts: getCollectionFn('accounts'),
	buckets: getCollectionFn('buckets'),
	projects: getCollectionFn('projects'),
	tasks: getCollectionFn('tasks')
};
