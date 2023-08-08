import {Router as router, Response, Request} from 'express' 
import {BankMethodArticle} from '../models/Articles/Article.js'
import {BankMethodCategory} from '../models/Category/Category.js'
import adminAuth from "../middlewares/adminAuth.js"
import {verify} from "../middlewares/jwtAuth.js"
import { IBankMethodArticle } from '../models/interface/IBankMethodArticle.js';
import { IBankMethodCategory } from '../models/interface/IBankMethodCategory.js'
import { ICategory } from '../models/interface/ICategory.js'
import { IArticle } from '../models/interface/IArticle.js'
import { container } from 'tsyringe'

export class ArticlesController {
    private _bankMethodArticle: IBankMethodArticle
    private _bankMethodCategory: IBankMethodCategory
    public router: router

    constructor(){
        this._bankMethodArticle = container.resolve(BankMethodArticle)
        this._bankMethodCategory = container.resolve(BankMethodCategory)
        this.router = router()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/admin/articles', adminAuth, verify, this.getArticlesIndex.bind(this));
        this.router.get('/admin/articles/new', adminAuth, verify, this.getArticlesNew.bind(this));
        this.router.post('/admin/articles/save', adminAuth, verify, this.postArticlesSave.bind(this));
        this.router.post('/admin/articles/delete', adminAuth, verify, this.postArticlesDelete.bind(this));
        this.router.get('/admin/articles/edit/:id', adminAuth, verify, this.getArticlesEditId.bind(this));
        this.router.post('/articles/update', adminAuth, verify, this.postArticlesUpdate.bind(this));
        this.router.get('/articles/page/:num', adminAuth, verify, this.getArticlesPagination.bind(this));
        this.router.get('/article/:id', this.getArticlesById.bind(this));
    }

    private async getArticlesById(req: Request, res: Response): Promise<void> {
        try{
            const result: IArticle = await this._bankMethodArticle.getById(req.params.id);
            const categories: ICategory[] = await this._bankMethodCategory.getAll()
            res.render("article", {article: result, categories: categories, session: req.session.login})
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/")
        }
    }

    private async getArticlesIndex(req: Request, res: Response): Promise<void> {
        try{
            const article: IArticle[] = await this._bankMethodArticle.getAllById(req.session.login)
            const categories: ICategory[] = await this._bankMethodCategory.getAll()
            res.render("admin/articles/index", {categories: categories, articles: article, session: req.session.login })
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/articles")
        }
    }

    private async getArticlesNew(req: Request, res: Response): Promise<void> {
        try{
            const categories: ICategory[] = await this._bankMethodCategory.getAll()
            res.render("admin/articles/new", {categories: categories, session: req.session.login})
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/articles")
        }
    }

    private async postArticlesSave(req: Request, res: Response): Promise<void>{
        try{
            await this._bankMethodArticle.create(req.body.title, req.body.body, req.body.category, req.session.login)
            return res.redirect("/admin/articles")
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/articles")
        }
    }

    private async postArticlesDelete(req: Request, res: Response): Promise<void>{
        try{
           await this._bankMethodArticle.delete(req.body.id)
            res.locals.error = req.flash("success", "Artigo deletado")
            return res.redirect("/admin/articles")
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/articles")
        }
    }

    private async getArticlesEditId(req: Request, res: Response): Promise<void>{
        try{
            const article: IArticle = await this._bankMethodArticle.edit(req.params.id)
            const categories: ICategory[] = await this._bankMethodCategory.getAll()
            return res.render("admin/articles/edit", {categories: categories, article: article, session: req.session.login})
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/articles")
        }
    }

    private async postArticlesUpdate(req: Request, res: Response): Promise<void>{
        try{
            await this._bankMethodArticle.update(req.body.id, req.body.title, req.body.body, req.body.category)
            return res.redirect("/admin/articles")
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/articles")
        }
    }

    private async getArticlesPagination(req: Request, res: Response): Promise<void>{
        try{
            const page: string = req.params.num
            const result: {
                result: {
                    page: number;
                    next: boolean;
                    articles: IArticle[];
                };
            } = await this._bankMethodArticle.pagination(page)
            const categories: ICategory[] = await this._bankMethodCategory.getAll()
            return res.render("admin/articles/page", {result: result.result, categories: categories, session: req.session.login})
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/articles")
        }
    }
}