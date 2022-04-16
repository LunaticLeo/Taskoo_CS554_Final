const router = require('express').Router();
const { getOrganzation } = require('../data/organzation');

router.get('/', async (req, res) => {

	try {
		const Data = await getOrganzation();
		res.json({ code: 200, message: '', data: Data });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

module.exports = router;