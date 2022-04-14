const dbConnection = require('../config/mongoConnection');
const mongoCollections = require('../config/mongoCollections');
const { DBStaticCollection, Account, Bucket } = require('../lib');
const { createProject } = require('../data/project');
const staticData = require('./static.json');

const insertStatic = async collectionName => {
	const collection = await mongoCollections[collectionName]();

	const data = staticData[collectionName].map(item => new DBStaticCollection(item));
	const { insertedIds } = await collection.insertMany(data);
	return insertedIds;
};

const insertAccounts = async (departmentIds, positionIds) => {
	// insert account
	const accountCol = await mongoCollections.accounts();
	const accountData = await Promise.all(
		staticData.account.map(
			async (item, index) =>
				await new Account({ ...item, department: departmentIds[0], position: positionIds[index] }).hashPwd()
		)
	);
	const { insertedIds: accountIds } = await accountCol.insertMany(accountData);

	// create bucket and bind owner id
	const bucketCol = await mongoCollections.buckets();
	const bucketData = Object.values(accountIds).map(id => new Bucket({ owner: id }));
	const { insertedIds: bucketIds } = await bucketCol.insertMany(bucketData);

	// update account to bind the bucket
	for (const index in Object.values(accountIds)) {
		await accountCol.updateOne({ _id: accountIds[index] }, { $set: { bucket: bucketIds[index] } });
	}
};

const insertProjects = async () => {

	const accountsCol = await mongoCollections["accounts"]();

	const accounts = await accountsCol.find().toArray()

	for (let i = 0; i < accounts.length; i++) {

		let projectObj = {

			"name": `project managed by ${accounts[i].firstName} ${accounts[i].lastName}`,
			"description": `project managed by ${accounts[i].firstName} ${accounts[i].lastName}`,
			"manager": {
				"role": "Manager",
				"fullName": accounts[i].firstName + accounts[i].lastName,
				"_id": accounts[i]._id,
				"avatar": accounts[i].avatar
			},
			"members":
				accounts.slice(0, i).concat(accounts.slice(i + 1, accounts.length)).map(ele => {
					return {
						"role": "worker",
						"fullName": `${ele.firstName} ${ele.lastName}`,
						"_id": ele._id,
						"avatar": ele.avatar
					}
				})
			,
			"status": "Pending",
			"tasks": [],
			"attachments": []
		}
		// console.log(projectObj)
		await createProject(projectObj, accounts[i].bucket);

	}


};

async function main() {
	const db = await dbConnection();
	await db.dropDatabase();
	try {
		const insertFunc = ['departments', 'positions', 'roles', 'status'].map(item => insertStatic(item));
		const [departmentIds, positionIds] = await Promise.all(insertFunc);
		await insertAccounts(departmentIds, positionIds);
		await insertProjects();
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
