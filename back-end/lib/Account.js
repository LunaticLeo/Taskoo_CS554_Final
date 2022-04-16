const Check = require('./Check');
const { DBCollection } = require('./Collection');
const bcrypt = require('bcrypt');
const saltRounds = 5;

class Account extends DBCollection {
	email = null;
	password = null;
	firstName = null;
	lastName = null;
	department = null;
	position = null;
	avatar = null;
	bucket = null;
	disabled = false;

	constructor(obj) {
		super(obj);
		obj?._id && delete obj._id;

		Object.keys(obj).forEach(key => (this[key] = obj[key]));
		this.checkValidation();
	}

	checkValidation() {
		const requiredFields = ['email', 'password', 'firstName', 'lastName', 'department', 'position'];
		for (const key of requiredFields) {
			if (this[key] === null || this[key] === undefined) {
				throw Error(`${key} is ${this[key]}`);
			}
			Check[key](this[key]);
		}
	}

	async hashPwd() {
		this.password = await bcrypt.hash(this.password, saltRounds);
		return this;
	}

	bindBucket(bucketId) {
		Check.bucket(bucketId);
		this.bucket = bucketId;
	}

	setAvatar(avatarUrl) {
		this.avatar = avatarUrl;
	}
}

module.exports = Account;
