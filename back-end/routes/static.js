const router = require('express').Router();
const  data  = require('../data');
const department=data.departments;
const positions=data.positions;
const roles=data.roles;
const status=data.status;

router.post('/departments', async (req, res) => {
	try {
        let departmentsList = await department.getDepartments();
        res.json(departmentsList);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.post('/departments/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must provide ID' });
        return;
    }
	try {
        let departmentsList = await department.getDepartmentbyId(req.params.id);
        res.json(departmentsList);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});


router.post('/positions', async (req, res) => {
	try {
        let positionsList = await positions.getPositions();
        res.json(positionsList);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.post('/positions/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must provide ID' });
        return;
    }
	try {
        let positionsList = await positions.getPositionsbyId(req.params.id);
        res.json(positionsList);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.post('/roles', async (req, res) => {
	try {
        let rolesList = await roles.getRoles();
        res.json(rolesList);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.post('/roles/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must provide ID' });
        return;
    }
	try {
        let rolesList = await roles.getRolebyId(req.params.id);
        res.json(rolesList);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.post('/status', async (req, res) => {
	try {
        let statusList = await status.getStatus();
        res.json(statusList);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.post('/status/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must provide ID' });
        return;
    }
	try {
        let statusList = await status.getStatusbyId(req.params.id);
        res.json(statusList);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});


module.exports = router;