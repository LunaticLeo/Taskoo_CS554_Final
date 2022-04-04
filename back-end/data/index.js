const file = require('./file');
const departmentsData = require('./static/departments');
const positionsData = require('./static/positions');
const rolesData = require('./static/roles');
const statusData = require('./static/status');

module.exports = {
	departments: departmentsData,
	positions: positionsData,
	roles : rolesData,
	status : statusData
};
