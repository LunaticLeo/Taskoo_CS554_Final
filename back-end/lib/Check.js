const { validate } = require('uuid');
const { isType } = require('../utils/helpers');
const Status = ['Pending', 'Processing', 'Testing', 'Done'];

module.exports = {
	_id(param) {
		if (!validate(param)) {
			throw Error(`_id: ${param} is not valid`);
		}
		return param;
	},

	name(param) {
		if (param === null || param === undefined) {
			throw Error('name is not provided');
		}

		if (!isType(param, 'string') || param.trim() === '') {
			throw Error(`name: ${param} is not valid`);
		}
		return param;
	},

	level(param) {
		if (param === null || param === undefined) {
			throw Error('level is not provided');
		}

		if (!isType(param, 'number') || isNaN(param)) {
			throw Error(`level: ${param} is not valid`);
		}
		return param;
	},

	prerequire(param) {
		if (![...Status, null].includes(param)) {
			throw Error('prerequire is not valid');
		}

		return param;
	},

	permit(param) {
		return this.level(param);
	},

	manager(param) {
		if (param === null || param === undefined) {
			throw Error('manager is not provided');
		}

		if (!validate(param)) {
			throw Error(`manager id: ${param} is not valid`);
		}
		return param;
	},

	bucket(param) {
		if (!validate(param)) {
			throw Error(`bucket id: ${param} is not valid`);
		}
		return param;
	},

	owner(param) {
		if (!validate(param)) {
			throw Error(`the id of owner: ${param} is not valid`);
		}
		return param;
	},

	firstName(param) {
		return this.name(param);
	},

	lastName(param) {
		return this.name(param);
	},

	// TODO
	email(param) {
		var reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
    	if (reg.test(param)) {
			return param;
		} else {
			throw Error(`The email ${param} is not valid`);
		}
	},

	password(param) {
		const isAlphanumeric = /^[0-9a-zA-Z]*$/
		const number = /[0-9]/; 
		const alphabet = /[a-z]/i
		if(param.length<8||param.length>16) throw Error(`Password's length is 8 to 16`)
		if(isAlphanumeric.test(param))
		{
			if(number.test(param))
			{
				if(alphabet.test(param))
				{
					return param
				}else{
					throw Error(`Password must have letter`)
				}
			}else{
				throw Error(`Password must have number`)
			}
		}else{
			throw Error(`Password can only contain numbers and letters`)
		}
	},

	department(param) {
		if (!validate(param)) {
			throw Error(`the id of department: ${param} is not valid`);
		}
		return param;
	},

	position(param) {
		if (!validate(param)) {
			throw Error(`the id of position: ${param} is not valid`);
		}
		return param;
	},

	status(param, allowNull = false) {
		if (allowNull) {
			if (![...Status, null].includes(param)) {
				throw Error(`status: ${param} is not valid`);
			}
		} else {
			if (param === null || param === undefined) {
				throw Error('status is not provided');
			}

			if (!isType(param, 'string') || param.trim() === '' || !Status.includes(param)) {
				throw Error(`status: ${param} is not valid`);
			}
		}

		return param;
	}
};
