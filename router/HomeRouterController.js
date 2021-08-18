const express = require('express')
const router = express.Router()
const Article = require("../models/Article")
const Category = require('../models/Category')
const adminAuth = require("../middlewares/adminAuth")
const verify = require("../middlewares/jwtAuth")

router.get('/', (req, res) => {
    
    Article.find().sort({_id: -1}).limit(4).then(articles =>{
        Category.find().then(categories => {
            res.render("indexHome", {articles: articles, categories: categories})
        })
    })
})

router.get('/home', adminAuth, verify, (req, res) => {

    Article.find().sort({_id: -1}).limit(4).then(articles =>{
        Category.find().then(categories => {
            res.render("indexHomeconn", {articles: articles, categories: categories})
        })
    })
})

module.exports = router