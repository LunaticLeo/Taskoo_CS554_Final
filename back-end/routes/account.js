const router = require('express').Router();
const {
	addToRegisterList,
	getRegisterInfo,
	getUserData,
	checkIdentity,
	getDepartmentMembers,
	decodeAccountInfo,
	uploadAvatar,
	createAccount
} = require('../data/account');
const Check = require('../lib/Check');

router.post('/register', async (req, res) => {
	const { email, firstName, lastName, department, position } = req.body;
	try {
		Object.keys(req.body).forEach(key => Check[key](req.body[key]));
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const registerId = await addToRegisterList({ firstName, lastName, department, position }, email);
		res.json({ code: 200, message: 'Add to register list successfully', data: registerId });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/registerInfo', async (req, res) => {
	const { registerId } = req.query;
	try {
		Check._id(registerId);
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	const registerInfo = await getRegisterInfo(registerId);
	if (!registerInfo) {
		return res.status(404).json({ code: 404, message: 'The register info is not exist or expired' });
	}

	res.json({ code: 200, message: '', data: registerInfo });
});

router.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	try {
		Check.email(email);
		Check.name(password); //check password missing
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	let userData;
	try {
		userData = await getUserData(email, password);
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}

	if (!userData) {
		return res.status(404).json({ code: 404, message: 'Account not exist' });
	}

	try {
		const accountInfo = await checkIdentity(userData, password);
		req.session.accountInfo = accountInfo;
		const decodedInfo = await decodeAccountInfo({ ...accountInfo });
		res.json({ code: 200, message: 'Sign in successfully', data: decodedInfo });
	} catch (error) {
		return res.status(400).json({ code: 400, message: error?.message ?? error });
	}
});

router.get('/members', async (req, res) => {
	const { department } = req.session.accountInfo;

	try {
		const members = await getDepartmentMembers(department);
		res.json({ code: 200, message: '', data: members });
	} catch (error) {
		return res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.post('/avatar', async (req, res) => {
	const { _id } = req.session.accountInfo;

	try {
		const url = await uploadAvatar(_id, req.file);
		res.json({ code: 200, message: 'Upload was successful', data: url });
	} catch (error) {
		return res.status(500).json({ message: error?.message ?? error });
	}
});

router.post('/signup', async (req, res) => {
	const { email, password, firstName, lastName, department, position } = req.body;
	try {
		Object.keys(req.body).forEach(key => Check[key](req.body[key]));
	} catch (error) {
		res.status(400).json({ code: 400, message: error?.message ?? error });
		return;
	}

	try {
		await createAccount(email, password, firstName, lastName, department, position);
		res.json({
			code: 200,
			message: "Sign up successfully",
			data: email
		})
	} catch (error) {
		res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.post('/signout', async (req, res) => {
	req.session.accountInfo = null;
	req.session.destroy();
	res.status(200).json({ "code": 200, "message": "You have been signed out" });
});

module.exports = router;
