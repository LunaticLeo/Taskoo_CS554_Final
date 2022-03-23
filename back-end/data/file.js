const path = require('path');
const serviceKey = path.join(__dirname, '../utils/google_keys.json');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: serviceKey, projectId: 'gallery-338502' });
const bucket = storage.bucket('taskoo_bucket');

/**
 * @param {File} file
 */
const upload = file =>
	new Promise((resolve, reject) => {
		const { name } = file;

		const blob = bucket.file(name.replace(/ /g, '_'));
		const blobStream = blob.createWriteStream({ resumable: false });
		blobStream
			.on('finish', async () => {
				const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
				await bucket.file(name).makePrivate();
				resolve(publicUrl);
			})
			.on('error', error => {
				console.log(error);
				reject(`Unable to upload file, something went wrong`);
			})
			.end();
	});

module.exports = { upload };
