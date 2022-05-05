const { accounts } = require('../config/mongoCollections');

const getMembers = async () => {
	const accountCol = await accounts();
	const accountList = await accountCol
		.aggregate([
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
