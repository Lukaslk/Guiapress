const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, 
        auth: {
          user: "3f1f0ed1a5b1f0", 
          pass: "46732e97ec285e", 
    },
});

module.exports = transporter