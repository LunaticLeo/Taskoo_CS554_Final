const { accounts } = require('../config/mongoCollections');

/**
 * get all the accounts by department
 * @param {object} pageConfig {pageNum: number, pageSize: number}
 */
const getMembers = async (department, { pageNum = 1, pageSize = 10 }) => {
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
			{ $skip: (+pageNum - 1) * +pageSize },
			{ $limit: +pageSize },
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
