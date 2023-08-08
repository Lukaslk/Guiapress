import {Router as router, Response, Request, NextFunction} from 'express' 
import {BankMethodCategory} from '../models/Category/Category.js'
import adminAuth from "../middlewares/adminAuth.js"
import {verify} from "../middlewares/jwtAuth.js"
import { Validation } from '../resources/Validation.js'
import { IValidation } from '../models/interface/iValidation.js'
import { IBankMethodCategory } from '../models/interface/IBankMethodCategory.js'
import { ErrorCanDelete } from '../models/errors/ErrorCanDelete.js'
import { IArticle } from '../models/interface/IArticle.js'
import { IBankMethodArticle } from '../models/interface/IBankMethodArticle.js'
import { BankMethodArticle } from '../models/Articles/Article.js'
import { ICategory } from '../models/interface/ICategory.js'
import { container } from 'tsyringe'

export class CategoryController {
    private _bankMethodCategory: IBankMethodCategory
    private _bankMethodArticle: IBankMethodArticle
    private _validation: IValidation
    public router: router

    constructor(){
        this._bankMethodCategory = container.resolve(BankMethodCategory)
        this._bankMethodArticle = container.resolve(BankMethodArticle)
        this._validation = container.resolve(Validation)
        this.router = router()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/admin/categories/new', adminAuth, verify, this.getCategoriesNew.bind(this));
        this.router.post('/categories/save', adminAuth, verify, this.postCategoriesSave.bind(this));
        this.router.get('/admin/categories', adminAuth, verify, this.getCategories.bind(this));
        this.router.post('/categories/delete', adminAuth, verify, this.postCategoriesDelete.bind(this));
        this.router.get('/admin/categories/edit/:id', adminAuth, verify, this.getCategoriesEdit.bind(this));
        this.router.post('/categories/update', adminAuth, verify, this.postCategoriesUpdate.bind(this));
    }

    private async getCategoriesNew(req: Request, res: Response): Promise<void> {
        res.render('admin/categories/new', {session: req.session.login})
    }

    private async postCategoriesSave(req: Request, res: Response): Promise<void> {
        try{
            this._validation.validationFields([req.body.title])
            await this._bankMethodCategory.create(req.body.title)
            return res.redirect("/admin/categories")
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/categories")
        }
    }

    private async getCategories(req: Request, res: Response): Promise<void> {
        try{
            const categories: ICategory[] = await this._bankMethodCategory.getAll()
            res.render("admin/categories/index", {categories: categories, session: req.session.login, error: req.flash("error"), success: req.flash("success")})
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/categories")
        }
    }

    private async postCategoriesDelete(req: Request, res: Response): Promise<void> {
        try{
            const value: IArticle = await this._bankMethodArticle.findArticleByCategoryId(req.body.id)
            if (value != null || value != undefined) throw new ErrorCanDelete("deleted")
            await this._bankMethodCategory.delete(req.body.id)
            res.locals.message = req.flash("success", "Artigo deletado")
            res.redirect("/admin/categories")
        } catch(error) {
            res.locals.message = req.flash("error", `${error}`)
            res.redirect("/admin/categories")
        }
    }

    private async getCategoriesEdit(req: Request, res: Response): Promise<void> {
        try{
            const value: IArticle = await this._bankMethodArticle.findArticleByCategoryId(req.params.id)
            if (value != null || value != undefined) throw new ErrorCanDelete("edited")
            const category: ICategory = await this._bankMethodCategory.edit(req.params.id)
            return res.render("admin/categories/edit", {category: category, session: req.session.login})
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/categories")
        }
    }

    private async postCategoriesUpdate(req: Request, res: Response): Promise<void> {
        try{
            await this._bankMethodCategory.update(req.body.id, req.body.title)
            return res.redirect("/admin/categories")
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/categories")
        }
    }
}