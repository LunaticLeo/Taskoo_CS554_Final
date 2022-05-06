const router = require('express').Router();
const {
	addToRegisterList,
	getRegisterInfo,
	getUserData,
	checkIdentity,
	getDepartmentMembers,
	decodeAccountInfo,
	uploadAvatar,
	createAccount,
	getPermission
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
		const url = await uploadAvatar(_id, req.files[0]);
		res.json({ code: 200, message: 'Upload was successful', data: url });
	} catch (error) {
		return res.status(500).json({ message: error?.message ?? error });
	}
});

router.post('/signup', async (req, res) => {
	try {
		Object.keys(req.body).forEach(key => Check[key](req.body[key]));
	} catch (error) {
		res.status(400).json({ code: 400, message: error?.message ?? error });
		return;
	}

	try {
		const email = await createAccount(req.body);
		res.json({
			code: 200,
			message: 'Sign up successfully',
			data: email
		});
	} catch (error) {
		res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.post('/signout', async (req, res) => {
	try {
		req.session.destroy();
		res.json({ code: 200, message: 'You have been signed out' });
	} catch (error) {
		res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/permission', async (req, res) => {
	const { position } = req.session.accountInfo;
	const { category } = req.query;

	try {
		if (!['projects', 'tasks'].includes(category)) throw Error('Invalid category');
	} catch (error) {
		res.status(400).json({ code: 400, message: error?.message ?? error });
	}

	try {
		const data = await getPermission(position, category);
		res.json({ code: 200, message: '', data });
	} catch (error) {
		res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

module.exports = router;
