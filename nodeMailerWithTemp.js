'use strict';
const nodemailer = require('nodemailer');

module.exports = (to,link)=>{
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail', // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER, // generated ethereal user
                pass: process.env.MAIL_PASS // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: `"${process.env.MAIL_SENDER}👻"`, // sender address
            to: `${to}`, // list of receivers
            subject: 'Reset Password Link ✔', // Subject line
            text: 'Hello world?', // plain text body
            html: `<b>Hi, please click this <a href='${link}'>link</a> to reset your password </b>` // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            // console.log('Message sent: %s', info.messageId);
            // // Preview only available when sending through an Ethereal account
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        });
    });
}


