const { accounts } = require('../config/mongoCollections');

/**
 * get all the accounts by department
 * @param {string} department 'self' | id
 */
const getMembers = async department => {
	const accountCol = await accounts();
	const match = department ? [{ $match: { department } }] : [];

	const accountList = await accountCol
		.aggregate([
			...match,
			{
				$lookup: {
					from: 'departments',
					localField: 'department',
					foreignField: '_id',
					as: 'department'
				}
			},
			{ $unwind: '$department' },
			{
				$lookup: {
					from: 'positions',
					localField: 'position',
					foreignField: '_id',
					as: 'position'
				}
			},
			{ $unwind: '$position' },
			{
				$project: { disabled: 0, password: 0, bucket: 0 }
			}
		])
		.toArray();

	return accountList;
};

module.exports = {
	getMembers
};
