const { addToRegisterList, getRegisterInfo, getUserData } = require('../data/account');
const Check = require('../lib/Check');

const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 16;

router.post('/register', async (req, res) => {
	// TODO check the login status and level

	const { email, firstName, lastName, department, position } = req.body;
	try {
		Object.keys(req.body).forEach(key => Check[key](req.body[key]));
	} catch (error) {
		res.status(400).json({ code: 400, message: error?.message ?? error });
		return;
	}

	try {
		const registerId = await addToRegisterList({ firstName, lastName, department, position }, email);
		res.json({ code: 200, message: 'Add to register list successfully', data: registerId });
	} catch (error) {
		res.status(500).json({ code: 500, message: error?.message ?? error });
	}
});

router.get('/registerInfo', async (req, res) => {
	const { registerId } = req.query;
	try {
		Check._id(registerId);
	} catch (error) {
		res.status(400).json({ code: 400, message: error?.message ?? error });
		return;
	}

	const registerInfo = await getRegisterInfo(registerId);
	if (!registerInfo) {
		res.status(404).json({ code: 404, message: 'The register info is not exist or expired' });
		return;
	}

	res.json({ code: 200, message: '', data: registerInfo });
});

router.post('/signin', async (req, res) => {
	const { email, password } = req.body;
	try {
		Check.email(email);
		Check.name(password);//check password missing
	} catch (error) {
		res.status(400).json({ code: 400, message: error?.message ?? error });
		return;
	}
	const userData = await getUserData(email);

	let comparePassword=await bcrypt.compare(password,userData.password);
	if (!userData || !comparePassword) {
		res.status(404).json({ code: 404, message: 'The register info is not exist or expired' });
		return;
	}

	res.json({ code: 200, message: 'Sign in successfully', data: userData });
});

module.exports = router;
