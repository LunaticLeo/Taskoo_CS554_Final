const sendMail = require('./index')

sendMail({
    from: 'taskoo.cs554final@gmail.com',
    to: 'yliao10@stevens.edu',
    subject: 'Message title',
    text: 'content'
});
