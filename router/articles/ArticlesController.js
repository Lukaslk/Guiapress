const express = require('express')
const router = express.Router()
const Category = require('../../models/Category')
const Article = require('../../models/Article')
const slugify = require('slugify')
const adminAuth = require("../../middlewares/adminAuth")
const verify = require("../../middlewares/jwtAuth")

router.get('/admin/articles',adminAuth, verify, (req, res)=> {
    Article.find().then(articles  =>{
        Category.find().then(categories => {
            res.render("admin/articles/index", {categories: categories, articles: articles})
        })
    })
})

router.get("/admin/articles/new", adminAuth, verify, (req,res)=> {
    Category.find().then(categories => {
        res.render("admin/articles/new", {categories: categories})
    })
})

router.post("/articles/save", adminAuth, verify, (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    let article = new Article({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    })

    article.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
            return;
        }
    });
        res.redirect("/admin/articles")
})

router.post("/articles/delete", adminAuth, verify, (req, res) => {
    let id = req.body.id

    if(id != undefined) {
             Article.findByIdAndRemove(id).then(() => {
                res.redirect("/admin/articles")
            })
        }else {
            res.redirect("/admin/articles")
        }
})

router.get("/admin/articles/edit/:id", adminAuth, verify, (req, res) => {
    let id = req.params.id
    Article.findById(id).then(article => {
        if(article != undefined){
            Category.find().then(categories => {
                
                res.render("admin/articles/edit", {categories: categories, article: article})
            })
            
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

router.post("/articles/update", adminAuth, verify, (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Article.findByIdAndUpdate(id, {title: title, body: body, categoryId: category, slug: slugify(title)})
    .then(() => {
        res.redirect("/admin/articles")
    }).catch(err => {
        res.redirect("/admin/articles")
    })
})

//Rota conectada
router.get("/articles/page/:num", (req, res) => {
    let page = req.params.num
    let offset = 0

    //Verifica se a page é um numero
    if(isNaN(page) || page == 1) {
        offset = 0
    } else {
        //Converte o page para numero e mult por 4 (É o limite de numero que ira aparecer de artigos na página)
        offset = parseInt(page) * 4
    }
    let articleSearch = Article.find().exec(function (err, results) {
        var count = results.length
        articleSearch = count
      });

    let query = {};
    let limit = 4;
    let skip = limit * (page - 1);
    
    Article.find(query).sort({_id: -1}).skip(skip).limit(limit).then(articles => {
        let next
        //Verifica se tem outras páginas para ser exibida
        if(offset + 4 > articleSearch) {
            next = false
        } else {
            next = true
        }        

        let result = { 
            page: parseInt(page),
            next: next, 
            articles: articles
        }       

        Category.find().then(categories => {
        res.render("admin/articles/page", {result: result, categories: categories})
        })
    })
})

//Rota desconectada
router.get("/articles/next/:num", (req, res) => {
    let page = req.params.num
    let offset = 0

    //Verifica se a page é um numero
    if(isNaN(page)) {
        offset = 0
    } else {
        //Converte o page para numero e mult por 4 (É o limite de numero que ira aparecer de artigos na página)
        offset = parseInt(page) * 4
    }
    let articleSearch = Article.find().exec(function (err, results) {
        var count = results.length
        articleSearch = count
      });

    let query = {};
    let limit = 4;
    let skip = limit * (page - 1);
    
    Article.find(query).sort({_id: -1}).skip(skip).limit(limit).then(articles => {
        let next
        //Verifica se tem outras páginas para ser exibida
        if(offset + 4 > articleSearch) {
            next = false
        } else {
            next = true
        }        

        let result = { 
            page: parseInt(page),
            next: next, 
            articles: articles
        }       

        Category.find().then(categories => {
        res.render("admin/articles/next", {result: result, categories: categories})
        })
    })
})

module.exports = router