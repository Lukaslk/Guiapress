const express = require('express')
const router = express.Router()
const Category = require('../../models/Category')
const slugify = require('slugify')
const adminAuth = require("../../middlewares/adminAuth")
const verify = require("../../middlewares/jwtAuth")


router.get('/admin/categories/new', adminAuth, verify,  (req, res) => {
    res.render('admin/categories/new')
})

router.post('/categories/save', adminAuth, verify, (req, res) => {
    let title = req.body.title
    if(title != undefined) {

        let category = new Category({
            title: title,
            slug: slugify(title)
        })

        category.save()
        res.redirect("/admin/categories")
        
    } else {
        res.render('admin/categories/new')
    }
})

router.get("/admin/categories", adminAuth, verify, (req, res) => {
    Category.find().then(categories => {
        res.render('admin/categories/index', {categories: categories})
    })
})

router.post("/categories/delete", adminAuth, verify, (req, res) => {
    let id = req.body.id

    if(id != undefined) {
        Category.findByIdAndRemove(id).then(() => {
            res.redirect("/admin/categories")
        })

    } else {
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories/edit/:id", adminAuth, verify, (req, res) => {
    let id = req.params.id
    Category.findById(id).then(category => {
        if(category != undefined){
            res.render("admin/categories/edit", {category: category})
        }else{
            res.redirect("/admin/categories")
        }
    }).catch(err => {
        res.redirect("/admin/categories")
    })
})

router.post("/categories/update", adminAuth, verify, (req, res) => {
    let id = req.body.id
    let title = req.body.title
    Category.findByIdAndUpdate(id, { title: title, slug: slugify(title) })
    .then(()=> {
        res.redirect('/admin/categories')
    })
})

module.exports = router