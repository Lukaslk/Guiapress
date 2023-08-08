import { createTransport } from "nodemailer"
import { IEmail } from "../interface/IEmail"

export class Email implements IEmail {
    public async Send(email: String, token: string): Promise<void> {
        try{
            await transporter.sendMail({
                from: "Teste", // sender address
                to: `${email}`, // list of receivers
                subject: "Please confirm your account", // Subject line
                html: 
                    `<h1>Email de confirmação</h1>
                    <h2>Olá</h2>
                    <p>Obrigado por se registrar. Por favor, confirme seu e-mail no link abaixo</p>
                    <a href=http://localhost:5000/verify-email?token=${token}> Click here</a>
                    </div>`
                })
        }catch(e){
            throw e
        }
    }

    public async redefinePassword(email: string, passToken: string): Promise<void> {
        try{
            await transporter.sendMail({
                from: process.env.FROM, // sender address
                to: `${email}`, // list of receivers
                subject: "Redefinir senha", // Subject line
                html: `<h1>Redefinir Senha</h1>
                <h2>Olá</h2>
                <p>Para redefinir a senha, acesse o link abaixo</p>
                <a href=http://localhost:5000/verify-reset?token=${passToken}> Click here</a>
                </div>`
            })
        }
        catch(e){
            throw e
        }
    }
}

export const transporter = createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, 
        auth: {
          user: "3f1f0ed1a5b1f0", 
          pass: "46732e97ec285e", 
    },
});