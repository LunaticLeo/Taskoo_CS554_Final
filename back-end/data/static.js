const client = require('../utils/redis');
const mongoCollections = require('../config/mongoCollections');
const Check = require('../lib/Check');

/**
 * get the static data from collection
 * @param {string} collectionName collection name in DB
 * @param {string} _id (optional) if provide, return the specific static data otherwise return the whole list
 * @returns {DBStaticCollection | DBStaticCollection[]}
 */
const getStaticData = async (collectionName, _id) => {
	let staticData;

	if (_id) {
		Check._id(_id);
		const collection = await mongoCollections[collectionName]();
		staticData = await collection.findOne({ _id });
	} else {
		const redisData = await client.get(collectionName);
		if (!redisData) {
			const collection = await mongoCollections[collectionName]();
			staticData = await collection.find({}).toArray();
			await client.set(collectionName, JSON.stringify(staticData));
		} else {
			staticData = JSON.parse(redisData);
		}
	}

	return staticData;
};

module.exports = {
	getStaticData
};
