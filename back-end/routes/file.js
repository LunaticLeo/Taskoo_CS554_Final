const router = require('express').Router();
const { file } = require('../data');

router.post('/upload', async (req, res) => {
	try {
		const attachment = req.file;
		const url = await file.upload(attachment);
		res.json({
			message: 'Upload was successful',
			data: url
		});
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

module.exports = router;
