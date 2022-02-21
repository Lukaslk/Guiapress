const nodemailer = require("nodemailer")
const transporter = require("./transporter")
require("dotenv").config()

try {
    async function sendEmail(email, token) {
    await transporter.sendMail({
        from: process.env.FROM, // sender address
        to: `${email}`, // list of receivers
        subject: "Please confirm your account", // Subject line
        html: 
            `<h1>Email de confirmação</h1>
            <h2>Olá</h2>
            <p>Obrigado por se registrar. Por favor, confirme seu e-mail no link abaixo</p>
            <a href=http://localhost:5000/verify-email?token=${token}> Click here</a>
            </div>`
        })
    }
    module.exports = sendEmail
} catch(e) {
    throw e
}
