const { getMembers } = require('../data/organization');

const router = require('express').Router();

router.get('/members', async (_, res) => {
	try {
		const data = await getMembers();
		res.json({ code: 200, message: '', data });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

module.exports = router;
