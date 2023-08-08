import "reflect-metadata"
import {Router as router, Response, Request} from 'express' 
import {BankMethodArticle} from '../models/Articles/Article.js'
import {IArticle} from '../models/interface/IArticle.js'
import {ICategory} from '../models/interface/ICategory.js'
import { IBankMethodArticle } from "../models/interface/IBankMethodArticle.js"
import { IBankMethodCategory } from "../models/interface/IBankMethodCategory.js"
import { BankMethodCategory } from "../models/Category/Category.js"
import { container } from "tsyringe"
export class HomeController {
    private _bankMethodCategory: IBankMethodCategory
    private _bankMethodArticles: IBankMethodArticle
    public router: router

    constructor(){
        this._bankMethodArticles = container.resolve(BankMethodArticle)
        this._bankMethodCategory = container.resolve(BankMethodCategory)
        this.router = router()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/', this.getHomeIndex.bind(this));
    }

    private async getHomeIndex(req: Request, res: Response): Promise<void> {
        try{
            const categories: ICategory[] = await this._bankMethodCategory.getAll()
            const articles: IArticle[] = await this._bankMethodArticles.getAll()
            res.render("index", {categories: categories, articles: articles, session: req.session.login })
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/articles")
        }
    }
}