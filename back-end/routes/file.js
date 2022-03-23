const router = require('express').Router();
const { file } = require('../data');

router.post('/upload', async (req, res) => {
	try {
		const { attachment } = req.files;
		const url = await file.upload(attachment);
		res.json({
			message: 'Upload was successful',
			data: url
		});
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
