const transporter = require("./transporter")
require("dotenv").config()

try {
    async function redefinePassword(email, passToken) {
    await transporter.sendMail({
        from: process.env.FROM, // sender address
        to: `${email}`, // list of receivers
        subject: "Please confirm your account", // Subject line
        html: `<h1>Email Reset de senha</h1>
        <h2>Olá</h2>
        <p>Para redefinir a senha, clique no link abaixo</p>
        <a href=http://localhost:5000/verify-reset?token=${passToken}> Click here</a>
        </div>`
        })
    }
    module.exports = redefinePassword
} catch(e) {
    throw e
}
