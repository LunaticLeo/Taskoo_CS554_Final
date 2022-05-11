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
	const Random = Mock.Random;

	Random.extend({
		positions: function () {
			return this.pick(Object.values(positionIds));
		}
	});

	const randomAccounts = Object.values(departmentIds).reduce((pre, cur) => {
		const count = ~~(Math.random() * 11) + 10;
		for (let i = 0; i < count; i++) {
			const firstName = Random.first();
			const lastName = Random.last();
			const accountSameNamecount = pre.filter(item=>item.firstName===firstName).length;
			const email=accountSameNamecount===0?firstName.toLowerCase() + '@taskoo.com':firstName.toLowerCase() +accountSameNamecount+ '@taskoo.com';
			pre.push(
				new Account({
					email,
					password: firstName[0]+lastName[0]+'123456',
					firstName,
					lastName,
					department: cur,
					position: Random.positions(),
					avatar: null,
					disabled: false
				})
			);
		}

		return pre;
	}, []);

	const accountData = await Promise.all(
		staticData.account.map(
			async (item, index) =>
				await new Account({ ...item, department: departmentIds[0], position: positionIds[0] }).hashPwd()
		)
	);
	const randomAccountData = await Promise.all(
		randomAccounts.map(
			async (item, index) =>
				await new Account({
					...item,
					department: departmentIds[Math.floor(Math.random() * Object.keys(departmentIds).length)],
					position:
						positionIds[
							(index + 1) % 5 == 0 ? 0 : Math.floor(Math.random() * (Object.keys(positionIds).length - 1) + 1)
						]
				}).hashPwd()
		)
	);
	Object.values(randomAccountData).map(item => accountData.push(item));
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
			const count = ~~(Math.random() * 11) + 20;
			for (let i = 0; i < count; i++) {
				await createProject(
					new Project({
						name: Random.title(2, 5),
						description: Random.sentence(),
						members: [
							{
								_id: manager._id,
								role: { _id: '584b21b7-57b5-4394-825c-f488c53c7d51', name: 'Manager' }
							},
							...members.map(ele => {
								return { _id: ele._id, role: Random.memberRoles() };
							})
						]
					}),
					manager.bucket
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
