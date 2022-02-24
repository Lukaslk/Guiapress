const express = require('express')
const app = express()
const session = require("express-session")
const flash = require("connect-flash")
const cors = require("cors")
const cookieParser = require('cookie-parser')
const Article = require('./models/Articles/Article')
const Category = require('./models/Category/Category')
require("dotenv").config()

const homeRouterController = require('./router/HomeRouterController')
const categoriesController = require('./router/CategoriesController')
const articlesController = require('./router/ArticlesController')
const userController = require('./router/UserController')

//recognize the incoming Request Object as strings or arrays. 
app.use(express.urlencoded({ extended: false}));
app.use(express.json())

app.use(cookieParser())

// Session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 300000}
}))
app.use(flash())

app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    )
    next()
})

//View engine
app.set('view engine', 'ejs')

app.use(cors())

//Static 
app.use(express.static('assets'))

//Rotas
app.use('/', homeRouterController)
app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', userController)

//Global function Flash
app.use(function(req, res, next) {
    res.locals.error = req.flash();
    next();
});

// Em manutenção
app.get("/:slug", (req, res) => {
    let slug = req.params.slug
    Article.findOne({slug: slug})
    .then(article => {
        if(article != undefined) {
            Category.find().then(categories => {
                res.render("article", {article: article, categories: categories})
            })
        } else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

app.get("/:category/:slug", (req, res) => {
    let slug = req.params.slug
    Category.findOne({slug: slug})
    .then(category => {
        if(category != undefined) {
            Category.find().then(categories => {
                Article.find().then(articles => {
                    res.render("index", {articles: articles, categories: categories})
                })
            })
        } else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

app.listen(5000, ()=>{ console.log("O servidor está rodando em http://localhost:5000")})