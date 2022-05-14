const nodemailer = require('nodemailer');
const Mail = require('nodemailer/lib/mailer');
const mailConfig = require('./mail.json');

const { toCapitalize } = require('./helpers');

/**
 * TODO
 * send email to target address
 * @param {Mail.Options} content the email detail content
 */
const sendEmail = async (to, template) => {
	const transporter = nodemailer.createTransport(mailConfig);
	
	const mail = { 'from': 'taskoo.cs554final@gmail.com', 'to': to, ...template };
	// send mail
	await transporter.sendMail(mail);
};

const registerMailTemplate = (firstName, registerId) => {
	const text = `
		Hi ${toCapitalize(firstName)},

		Welcome to Taskoo, please click the link below to start sign up your account.
		This link will expire in 1 hour.

		http://localhost:3000/#/account/signup/${registerId}

		Best,
		Taskoo Team
	`;

	return {
		"subject": "Taskoo Register Invitation",
		"text": text
	};
};

const projectCreatedMailTemplate = (firstName, projectName, projectId) => {
	const text = `
		Hi ${toCapitalize(firstName)},

		${projectName} (${projectId}) is created for you, please click the link blow to view the details. 
		This link will not expire.

		http://localhost:3000/#/home/project/${projectId}

		Best,
		Taskoo Team
	`;
	return {
		"subject": "Project Created Reminder",
		"text": text
	};
};

module.exports = {
	sendEmail,
	registerMailTemplate,
	projectCreatedMailTemplate
};

