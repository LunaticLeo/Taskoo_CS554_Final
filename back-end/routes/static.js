const router = require('express').Router();
const { getStaticData } = require('../data/static');
const Check = require('../lib/Check');

router.get('/:collection', async (req, res) => {
	const { collection } = req.params;
	const { id } = req.query;

	try {
		id && Check._id(id);
	} catch (error) {
		res.status(400).json({ code: 400, message: error?.message ?? error });
		return;
	}

	try {
		const staticData = await getStaticData(collection, id);
		res.json({ code: 200, message: '', data: staticData });
	} catch (error) {
		res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

module.exports = router;
