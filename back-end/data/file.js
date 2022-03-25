const path = require('path');
const serviceKey = path.join(__dirname, '../utils/google_keys.json');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: serviceKey, projectId: 'gallery-338502' });
const bucket = storage.bucket('taskoo_bucket');

/**
 * @param {File} file
 * @returns {Promise<String>} the url of the file
 */
const upload = file =>
	new Promise((resolve, reject) => {
		const { originalname, buffer } = file;

		const blob = bucket.file(originalname.replace(/ /g, '_'));
		const blobStream = blob.createWriteStream({ resumable: false });
		blobStream
			.on('finish', async () => {
				const publicUrl = `https://storage.cloud.google.com/${bucket.name}/${blob.name}`;
				resolve(publicUrl);
			})
			.on('error', () => {
				reject(`Unable to upload file, something went wrong`);
			})
			.end(buffer);
	});

module.exports = { upload };
