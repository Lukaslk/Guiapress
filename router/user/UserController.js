const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("../../models/User")
const Category = require('../../models/Category')
const Article = require('../../models/Article')
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
require("dotenv").config()
const flash = require("connect-flash")

router.get("/admin/user/create", (req,res) => {
    res.render("admin/users/create", {error: req.flash("error"), success: req.flash("success")})
})

router.post("/user/create", function(req,res) {
    let email = req.body.email
    let password = req.body.password
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(password, salt)

    User.findOne({email}).then(user => {

        if(user) {
            res.locals.error = req.flash("error", "email já existe")
            res.redirect("/admin/user/create")
        }

        if(user == undefined) {
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)
            const token = jwt.sign(
                {email: email},process.env.JWTSECRET,{expiresIn:'30m'})
            const passToken = jwt.sign(
                {email: email},process.env.JWTSCRETRESET,{expiresIn:'30m'})

            let newUser = new User({
                email: email,
                password: hash,
                token: token,
                confirmationCode: token,
                confirmationResetCode: passToken
            })

            let transporter = nodemailer.createTransport({
                host: process.env.HOST,
                port: process.env.PORT,
                secure: false, 
                auth: {
                  user: "", 
                  pass: "", 
                },
              });
            

            transporter.sendMail({
            from: process.env.FROM, // sender address
            to: `${email}`, // list of receivers
            subject: "Please confirm your account", // Subject line
            html: `<h1>Email de confirmação</h1>
            <h2>Olá</h2>
            <p>Obrigado por se registrar. Por favor, confirme seu e-mail no link abaixo</p>
            <a href=http://localhost:5000/verify-email?token=${token}> Click here</a>
            </div>`
            }).then(mes =>{
                console.log(mes)
            }).catch(err =>{
                console.log(err)
            })

            newUser.save((err) => {
                if (err) {
                  res.status(500).send({ message: err });
                       return;
                }
                res.locals.error = req.flash("success", "E-mail de confirmação enviado, verifique sua caixa de E-mail")
                res.redirect("/admin/user/create")
                
            });
        }
    }) 
})

router.get("/verify-email", async (req, res) => {

const user =  await User.findOne({confirmationCode: req.query.token})
    if(!user){
        res.send({Message: "Erro"})
    } else{
        user.status = "Active"
        user.save()
    }
    res.redirect("/login")
})

router.get("/resend-email", (req,res) => {
    res.render("admin/users/resend-email", {error: req.flash("error"), success: req.flash("success")})
})

router.post("/refresh-token", (req, res) => {
    let email = req.body.email

    User.findOne({email}).then(user => {
        if(!user) {
            res.locals.error = req.flash("error", "E-mail não localizado")
            res.redirect("/admin/user/create")
        }
        if(user) {
            const token = jwt.sign(
                {email: email},process.env.JWTSECRET,{expiresIn:'30m'})

            let transporter = nodemailer.createTransport({
                host: process.env.HOST,
                port: process.env.PORT,
                secure: false, 
                auth: {
                  user: "", 
                  pass: "", 
                },
              });
            

            transporter.sendMail({
            from: process.env.FROM, // sender address
            to: `${email}`, // list of receivers
            subject: "Please confirm your account", // Subject line
            html: `<h1>Email de confirmação</h1>
            <h2>Olá</h2>
            <p>Obrigado por se registrar. Por favor, confirme seu e-mail no link abaixo</p>
            <a href=http://localhost:5000/verify-email?token=${token}> Click here</a>
            </div>`
            }).then(mes =>{
                console.log(mes)
            }).catch(err =>{
                console.log(err)
            })

            user.save((err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                } else {
                    user.confirmationCode = token
                    user.save()
                }
                res.locals.error = req.flash("success", "E-mail de confirmação enviado, verifique sua caixa de E-mail!")
                return res.redirect("/admin/user/create")
            })
        }
    }) 
})

router.get("/login", (req, res) => {
    res.render("admin/users/login", {error: req.flash("error"), success: req.flash("success")})
})

router.post("/authenticate",  async(req, res, next) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({email: email}).then(user => {        
          if(!user) {
           res.locals.error = req.flash("error", "E-mail não cadastrado")
           return res.redirect("/login")
        }

        if (user.status != "Active") {
            res.locals.error = req.flash("error", "Conta pendente de Ativação, por favor, verifique o seu E-mail!")
            return res.redirect("/login")
          }
    
        if(user != undefined) {
            // Validar senha
            let correct = bcrypt.compareSync(password, user.password)            
            if(correct) {                
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                const token = jwt.sign({id: user.id, email: user.email},process.env.JWTSECRET,{expiresIn:'1d'})
                res.cookie('token', token, { httpOnly: true })
                res.redirect("/admin/articles")
            }else{
                res.locals.error = req.flash("error", "Ocorreu um erro inesperado, por favor, tente novamente!")
                return res.redirect("/login")
            }
        }else {
            res.locals.error = req.flash("error", "Ocorreu um erro inesperado, por favor, tente novamente!")
            return res.redirect("/login")
        }
    })
})

router.get('/forgot', (req, res) => {
    res.render("admin/users/forgot", {error: req.flash("error"), success: req.flash("success")})
})

router.post("/reset", (req, res) => {
    let email = req.body.email

    User.findOne({email}).then(user => {
        if(!user) {
            res.locals.error = req.flash("error", "E-mail não encontrado!")
            return res.redirect("/forgot")
        }
        const passToken = jwt.sign(
            {email: email},process.env.JWTSCRETRESET,{expiresIn:'30m'})

        let transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.PORT,
            secure: false, 
            auth: {
                user: "",
                pass: "",
            },
        });
            
        transporter.sendMail({
        from: process.env.FROM,
        to: `${email}`,
        subject: "Please confirm your reset password",
        html: `<h1>Email Reset de senha</h1>
        <h2>Olá</h2>
        <p>Para redefinir a senha, clique no link abaixo</p>
        <a href=http://localhost:5000/verify-reset?token=${passToken}> Click here</a>
        </div>`
        }).then(mes =>{
            console.log(mes)
        }).catch(err =>{
            console.log(err)
        })

        user.save((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            } else {
                user.confirmationResetCode = passToken
                user.save()
            }
            res.locals.error = req.flash("success", "E-mail de reset enviado, verifique sua caixa de E-mail!")
            return res.redirect("/forgot")
        })
    })
})

router.get("/verify-reset", async (req, res) => {
    const user = await User.findOne({confirmationResetCode: req.query.token})
    if(!user) {
        res.locals.error = req.flash("error", "Token incorreto")
        return res.redirect("/forgot")
    } else if(user != undefined) {
        res.render("admin/users/new-password", {user: user, email: user.email, error: req.flash("error"), success: req.flash("success")})
    }
})

router.post("/authpassword", (req, res) => {
    let email = req.body.email
    
    User.findOne({email: email}).then((user, err) => {
        let password = req.body.password
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(password, salt)

        if(user.email = undefined){
            res.locals.error = req.flash("error", "E-mail não cadastrado")
            return res.redirect("/forgot")
        } else if(err){
            res.locals.error = req.flash("error", "Ocorreu um erro inesperado, tente novamente!")
            return res.redirect("/forgot")
        } else {
            user.confirmationResetCode = null
            user.email = email
            user.password = hash
            user.save()
        }     
        
        res.redirect("/login")
    })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/login")
})

module.exports = router