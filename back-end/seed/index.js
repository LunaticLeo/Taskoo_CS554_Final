const dbConnection = require('../config/mongoConnection');
const mongoCollections = require('../config/mongoCollections');
const { DBStaticCollection, Account, Bucket, Project } = require('../lib');
const { createProject } = require('../data/project');
const staticData = require('./static.json');
const Mock = require('mockjs');

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
	const accountsCol = await mongoCollections['accounts']();
	const accounts = await accountsCol.find().toArray();
	const managers = accounts.filter(item => item.position === '01bcb711-f5c4-44bc-a0fe-949b1a4e1273');
	const roles = staticData.roles.filter(item => item._id !== '584b21b7-57b5-4394-825c-f488c53c7d51');
	const members = accounts.filter(item => item.position !== '01bcb711-f5c4-44bc-a0fe-949b1a4e1273');

	const Random = Mock.Random;
	Random.extend({
		memberRoles: function () {
			return this.pick(roles);
		}
	});

	await Promise.all(
		managers.map(async manager => {
			const count = ~~(Math.random() * 2) + 1;
			for (let i = 0; i < count; i++) {
				await createProject(
					new Project(
						{
							name: Random.title(2, 5),
							description: Random.sentence(),
							manager: {
								_id: manager._id,
								role: 'Manager',
								roleName: '584b21b7-57b5-4394-825c-f488c53c7d51'
							},
							members: members.map(ele => {
								const { _id: role, name: roleName } = Random.memberRoles();
								return { _id: ele._id, role, roleName };
							})
						},
						manager.bucket
					)
				);
			}
		})
	);
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
