const client = require('../utils/redis');
const router = require('express').Router();
const { getStaticData } = require('../data/static');
const Check = require('../lib/Check');

router.get('/:collection', async (req, res, next) => {
	const { collection } = req.params;
	const { id } = req.query;

	try {
		id && Check._id(id);
	} catch (error) {
		res.status(400).json({ code: 400, message: error?.message ?? error });
		return;
	}

	try {
		const redisData = await client.get(collection);
		redisData ? res.json({ code: 200, message: '', data: JSON.parse(staticData) }) : next();
	} catch (error) {
		res.status(500).json({ code: 400, message: error?.message ?? error });
	}
});

router.get('/:collection', async (req, res) => {
	const { collection } = req.params;
	const { id } = req.query;

	try {
		const staticData = await getStaticData(collection, id);
		!id && (await client.set(collection, JSON.stringify(staticData)));
		res.json({ code: 200, message: '', data: staticData });
	} catch (error) {
		res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

module.exports = router;
