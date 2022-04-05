const mongoCollections = require('../config/mongoCollections');
const Check = require('../lib/Check');

/**
 * get the static data from collection
 * @param {string} collectionName collection name in DB
 * @param {string} _id optional (if provide, return the specific static data otherwise return the whole list)
 * @returns {DBStaticCollection | DBStaticCollection[]}
 */
const getStaticData = async (collectionName, _id) => {
	const collection = await mongoCollections[collectionName]();

	let staticData;
	if (_id) {
		Check._id(_id);
		staticData = await collection.findOne({ _id });
	} else {
		staticData = await collection.find({}).toArray();
	}

	return staticData;
};

module.exports = {
	getStaticData
};
