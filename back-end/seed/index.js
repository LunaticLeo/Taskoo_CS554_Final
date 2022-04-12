const dbConnection = require('../config/mongoConnection');
const mongoCollections = require('../config/mongoCollections');
const { DBStaticCollection, Account, Bucket } = require('../lib');
const staticData = require('./static.json');

const insertStatic = async collectionName => {
	const collection = await mongoCollections[collectionName]();

	const data = staticData[collectionName].map(item => new DBStaticCollection(item));
	const { insertedIds } = await collection.insertMany(data);
	return insertedIds;
};

const insertAccounts = async (departmentIds, positionIds) => {
	// insert account
	const accountCol = await mongoCollections.account();
	const accountData = await Promise.all(
		staticData.account.map(
			async (item, index) =>
				await new Account({ ...item, department: departmentIds[0], position: positionIds[index] }).hashPwd()
		)
	);
	const { insertedIds: accountIds } = await accountsCol.insertMany(accountData);

	// create bucket and bind owner id
	const bucketCol = await mongoCollections.bucket();
	const bucketData = Object.values(accountIds).map(id => new Bucket({ owner: id }));
	const { insertedIds: bucketIds } = await bucketsCol.insertMany(bucketData);

	// update account to bind the bucket
	for (const index in Object.values(accountIds)) {
		await accountsCol.updateOne({ _id: accountIds[index] }, { $set: { bucket: bucketIds[index] } });
	}
};

async function main() {
	const db = await dbConnection();
	await db.dropDatabase();
	try {
		const insertFunc = ['departments', 'positions', 'roles', 'status'].map(item => insertStatic(item));
		const [departmentIds, positionIds] = await Promise.all(insertFunc);
		await insertAccounts(departmentIds, positionIds);

		console.log('Done seeding database');
	} catch (error) {
		console.error(error);
		// drop the database if errors occured
		await db.dropDatabase();
	} finally {
		// close the connection
		await db.s.client.close();
	}
}

main();
