const nodemailer = require('nodemailer');
const config = require('../utils/mail.json');
const transporter = nodemailer.createTransport(config);

// mail = {
//     from: 'taskoo.cs554final@gmail.com',
//     to: 'yliao10@stevens.edu',
//     subject: 'Message title',
//     text: 'content'
// };

// nodemailer API: https://nodemailer.com/about/

function sendMail(mail){
    transporter.sendMail(mail, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export default sendMail;