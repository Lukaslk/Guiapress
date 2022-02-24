const express = require('express')
const router = express.Router()
const Production = require('../models/Category/Production')
const BankMethod = require('../models/Category/BankMethod')
const adminAuth = require("../middlewares/adminAuth")
const verify = require("../middlewares/jwtAuth")


router.get('/admin/categories/new', adminAuth, verify,  (req, res) => {
    res.render('admin/categories/new')
})

router.post('/categories/save', adminAuth, verify, async (req, res) => {
    try{
        const reqBody = req.body.title
        const received = new Production({ title: reqBody })
        await received.createCategory()
        return res.redirect("/admin/categories")
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories", adminAuth, verify, async (req, res) => {
    try{
        const result = await BankMethod.getAll()
        res.render("admin/categories/index", {categories: result })
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/admin/categories")
    }
})

router.post("/categories/delete", adminAuth, verify, async(req, res) => {
    try{
        const reqBody = req.body.id
        const received = new Production({ id: reqBody })
        await received.searchIdAndDelete()
        res.locals.error = req.flash("success", "Artigo deletado")
        return res.redirect("/admin/categories")
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        console.log(e)
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories/edit/:id", adminAuth, verify, async(req, res) => {
    try{
        const reqParams = req.params.id
        const received = new Production({ id: reqParams})
        await received.searchIdAndEdit()
        return res.render("admin/categories/edit", {category: received})
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        console.log(e)
        res.redirect("/admin/categories")
    }
})

router.post("/categories/update", adminAuth, verify, async(req, res) => {
    try{
        const id = req.body.id
        const title = req.body.title
        const received = new Production({id: id, title: title })
        await received.updateById()
        return res.redirect("/admin/categories")
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        console.log(e)
        res.redirect("/admin/categories")
    }
})

module.exports = router