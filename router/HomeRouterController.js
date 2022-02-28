const express = require('express')
const router = express.Router()
const BankMethod = require('../models/Home/BankMethod')
const adminAuth = require("../middlewares/adminAuth")
const verify = require("../middlewares/jwtAuth")

router.get('/', async (req, res) => {
    try{
        const result = await BankMethod.getAll()
        res.render("indexHome", {categories: result.categories, articles: result.articles })
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/admin/articles")
    }
})

router.get('/home', adminAuth, verify, async (req, res) => {
    try{
        const result = await BankMethod.getAll()
        res.render("indexHomeconn", {categories: result.categories, articles: result.articles })
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/admin/articles")
    }
})

module.exports = router