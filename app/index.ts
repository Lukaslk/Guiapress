import "reflect-metadata"
import express from 'express'
import session from 'express-session'
import flash from 'connect-flash'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {HomeController} from'./router/HomeRouterController.js'
import {CategoryController} from'./router/CategoriesController.js'
import {ArticlesController} from'./router/ArticlesController.js'
import {UserController} from'./router/UserController.js'
import path from 'path';
import {db} from './database/database.js';
import { container } from "tsyringe"

db

const app = express()

require("dotenv").config()

app.use(express.urlencoded({ extended: false}));
app.use(express.json())

app.use(cookieParser())

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 300000}
}))
app.use(flash())

app.use(function(req, res, next) {
    res.locals.message = req.flash();
    next();
});

app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    )
    next()
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(cors())

app.use(express.static('assets'))
app.use('/css', express.static(path.join(__dirname, 'css'), {
    setHeaders: (res, filePath) => {
      if (path.extname(filePath) === '.css') {
        res.set('Content-Type', 'text/css');
      }
    },
}));

app.use('/', container.resolve(HomeController).router)
app.use('/', container.resolve(CategoryController).router)
app.use('/', container.resolve(ArticlesController).router)
app.use('/', container.resolve(UserController).router)

app.listen(5000, ()=>{ console.log("O servidor está rodando em http://localhost:5000")})