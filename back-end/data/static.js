const client = require('../utils/redis');
const mongoCollections = require('../config/mongoCollections');
const Check = require('../lib/Check');

/**
 * get the static data from collection
 * @param {string} collectionName collection name in DB
 * @param {string} _id (optional) if provide, return the specific static data otherwise return the whole list
 * @returns {Promise<DBStaticCollection | DBStaticCollection[]>}
 */
const getStaticData = async (collectionName, _id) => {
	_id && Check._id(_id);
	if (!(await client.hLen(collectionName))) {
		const collection = await mongoCollections[collectionName]();
		const staticList = await collection.find({}).toArray();
		await Promise.all(staticList.map(async item => await client.hSet(collectionName, item._id, JSON.stringify(item))));
	}

	let staticData;
	if (_id) {
		staticData = JSON.parse(await client.hGet(collectionName, _id));
	} else {
		staticData = (await client.hVals(collectionName)).map(item => JSON.parse(item));
	}

	return staticData;
};

module.exports = {
	getStaticData
};
