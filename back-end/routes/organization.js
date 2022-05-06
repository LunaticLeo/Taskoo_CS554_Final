const { getMembers } = require('../data/organization');
const { Check } = require('../lib');

const router = require('express').Router();

router.get('/members', async (req, res) => {
	const { department } = req.query;

	try {
		if (![undefined, 'self'].includes(department)) {
			Check.department(department);
		}
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		let _department = department === 'self' ? req.session.accountInfo.department : department;
		const data = await getMembers(_department);
		res.json({ code: 200, message: '', data });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

module.exports = router;
