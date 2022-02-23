const express = require("express")
const router = express.Router()
const Production = require("../models/User/Production")
require("dotenv").config()

router.get("/admin/user/create", (req,res) => {
    res.render("admin/users/create", {error: req.flash("error"), success: req.flash("success")})
})

router.post("/user/create", async function(req,res) {
    try{
        let reqBody = req.body
        const user = new Production(reqBody)
        await user.createUser()
        res.locals.error = req.flash("success", "E-mail de confirmação enviado, verifique sua caixa de E-mail")
        return res.redirect("/admin/user/create")
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/admin/user/create")
    }
})

router.get("/verify-email", async (req, res) => {
    try{
        const reqToken = req.query.token
        const result = new Production({confirmationCode: reqToken})
        await result.confirmationCodeUser()
        return res.redirect("/login")
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/login")
    }
})

router.get("/resend-email", (req,res) => {
    res.render("admin/users/resend-email", {error: req.flash("error"), success: req.flash("success")})
})

router.post("/refresh-token", async (req, res) => {
    try{
        let email = req.body
        const user = new Production(email)
        await user.refreshTokenConfirmation()
        res.locals.error = req.flash("success", "E-mail de confirmação enviado, verifique sua caixa de E-mail!")
        return res.redirect("/admin/user/create")
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/login")
    }
})

router.get("/login", (req, res) => {
    res.render("admin/users/login", {error: req.flash("error"), success: req.flash("success")})
})

router.post("/authenticate",  async(req, res, next) => {
    try{
        let email = req.body.email
        let pass = req.body.password
        const user = new Production({email: email, password: pass})
        await user.authenticate()
        req.session.login = user
        res.cookie('token', user.token, { httpOnly: true }).redirect("/admin/articles")
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/login")
    }
})

router.get('/forgot', (req, res) => {
    res.render("admin/users/forgot", {error: req.flash("error"), success: req.flash("success")})
})

router.post("/reset", async (req, res) => {
    try{
        let email = req.body.email
        const user = new Production({email: email})
        await user.reset()
        res.locals.error = req.flash("success", "E-mail de reset enviado, verifique sua caixa de E-mail!")
        res.redirect("/forgot")
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/login")
    }
})

router.get("/verify-reset", async (req, res) => {
    try{
        const reqQuery = req.query.token
        const user = new Production({confirmationResetCode: reqQuery})
        await user.verifyReset()
        res.render("admin/users/new-password", {user: user, email: user.email, error: req.flash("error"), success: req.flash("success")})
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/login")
    }
})

router.post("/authpassword", async (req, res) => {
    try{
        const reqBody = req.body
        const user = new Production({email: reqBody.email, password: reqBody.password})
        await user.authPassword()
        res.redirect("/login")
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/login")
    }
})

router.get("/logout", (req, res) => {
    req.session.login = undefined
    res.clearCookie("token")
    res.redirect("/login")
})

module.exports = router