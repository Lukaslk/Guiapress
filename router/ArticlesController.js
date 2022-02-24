const express = require('express')
const router = express.Router()
const BankMethod = require('../models/Articles/BankMethod')
const BankMethodCategory = require('../models/Category/BankMethod')
const Production = require('../models/Articles/Production')
const slugify = require('slugify')
const adminAuth = require("../middlewares/adminAuth")
const verify = require("../middlewares/jwtAuth")

router.get('/admin/articles',adminAuth, verify, async (req, res)=> {
    try{
        const result = await BankMethod.getAll()
        res.render("admin/articles/index", {categories: result.categories, articles: result.articles })
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/new", adminAuth, verify, async (req,res)=> {
    try{
        const result = await BankMethodCategory.getAll()
        res.render("admin/articles/new", {categories: result})
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/admin/articles")
    }
})

router.post("/articles/save", adminAuth, verify, async (req, res) => {
    try{
        const reqBody = req.body
        const received = new Production({ title: reqBody.title, body: reqBody.body, categoryId: reqBody.category })
        await received.createArticle()
        return res.redirect("/admin/articles")
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/admin/articles")
    }
})

router.post("/articles/delete", adminAuth, verify, async (req, res) => {
    try{
        const reqBody = req.body
        const received = new Production({ id: reqBody.id })
        await received.searchIdAndDelete()
        res.locals.error = req.flash("success", "Artigo deletado")
        return res.redirect("/admin/articles")
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id", adminAuth, verify, async (req, res) => {
    try{
        const reqParams = req.params.id
        const received = new Production({ id: reqParams})
        await received.searchIdAndEdit()
        return res.render("admin/articles/edit", {categories: received.category, article: received})
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/admin/articles")
    }
})

router.post("/articles/update", adminAuth, verify, async (req, res) => {
    try{
        const id = req.body.id
        const title = req.body.title
        const body = req.body.body
        const category = req.body.category
        const received = new Production({id: id, title: title, body: body, categoryId: category, 
            slug: slugify(title)})

        await received.updateById()
        return res.redirect("/admin/articles")
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        console.log(e)
        res.redirect("/admin/articles")
    }
})

//Rota conectada
router.get("/articles/page/:num", async (req, res) => {
    try{
        const page = req.params.num
        const result = await BankMethod.pagination(page)
        return res.render("admin/articles/page", {result: result.result, categories: result.categories})
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/admin/articles")
    }
})

//Rota desconectada
router.get("/articles/next/:num", async (req, res) => {
    try{
        const page = req.params.num
        const result = await BankMethod.paginationNotLoggeIn(page)
        return res.render("admin/articles/next", {result: result.result, categories: result.categories})
    } catch(e) {
        res.locals.error = req.flash("error", `${e}`)
        res.redirect("/admin/articles")
    }
})

module.exports = router