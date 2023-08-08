require("dotenv").config()
import {Router as router, Response, Request} from 'express'
import { BankMethodUser } from '../models/User/User.js';
import { IBankMethodUser } from '../models/interface/IBankMethodUser.js';
import { IUser } from '../models/interface/IUser.js';
import { container } from 'tsyringe';
declare module 'express-session' {
    interface Session { login: string; }
}

export class UserController {
    public router: router
    private _bankMethodUser: IBankMethodUser

    constructor(){
        this.router = router()
        this.initializeRoutes()
        this._bankMethodUser = container.resolve(BankMethodUser)
    }

    private initializeRoutes(): void {
        this.router.get('/admin/user/create', this.getUserCreate.bind(this));
        this.router.post('/user/create', this.postUserCreate.bind(this));
        this.router.get('/verify-email', this.getVerifyEmail.bind(this));
        this.router.get('/resend-email', this.getResendEmail.bind(this));
        this.router.post('/refresh-token', this.postRefreshToken.bind(this));
        this.router.get('/login', this.getLogin.bind(this));
        this.router.post('/authenticate', this.postAuthenticate.bind(this));
        this.router.get('/forgot', this.getForgot.bind(this));
        this.router.post('/reset', this.postReset.bind(this));
        this.router.get('/verify-reset', this.getVerifyReset.bind(this));
        this.router.post('/authpassword', this.postAuthPassword.bind(this));
        this.router.get('/logout', this.getLogout.bind(this));
    }

    private async getUserCreate(req: Request, res: Response): Promise<void> {
        res.render("admin/users/create", {error: req.flash("error"), success: req.flash("success"), session: req.session.login})
    }

    private async postUserCreate(req: Request, res: Response): Promise<void> {
        try{
            await this._bankMethodUser.insert(req.body.email, req.body.password)
            res.locals.message = req.flash("success", "E-mail de confirmação enviado, verifique sua caixa de E-mail")
            res.redirect("/admin/user/create")
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/admin/user/create")
        }
    }

    private async getVerifyEmail(req: Request, res: Response): Promise<void> {
        try{
            await this._bankMethodUser.verify(String(req.query.token))
            res.redirect("/login")
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/login")
        }
    }

    private async getResendEmail(req: Request, res: Response): Promise<void> {
        res.render("admin/users/resend-email", {error: req.flash("error"), success: req.flash("success")})
    }

    private async postRefreshToken(req: Request, res: Response): Promise<void> {
        try{
            await this._bankMethodUser.verifyRefreshToken(req.body.email)
            res.locals.message = req.flash("success", "E-mail de confirmação enviado, verifique sua caixa de E-mail!")
            res.redirect("/admin/user/create")
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/login")
        }
    }

    private async getLogin(req: Request, res: Response): Promise<void> {
        res.render("admin/users/login", {error: req.flash("error"), success: req.flash("success")})
    }

    private async postAuthenticate(req: Request, res: Response): Promise<void> {
        try{
            const token: string = await this._bankMethodUser.verifyAuthenticate(req.body.email, req.body.password)
            req.session.login = token
            res.cookie('token', token, { httpOnly: true }).redirect("/admin/articles")
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/login")
        }
    }

    private async getForgot(req: Request, res: Response): Promise<void> {
        res.render("admin/users/forgot", {error: req.flash("error"), success: req.flash("success")})
    }

    private async postReset(req: Request, res: Response): Promise<void> {
        try{
            await this._bankMethodUser.processReset(req.body.email)
            res.locals.message = req.flash("success", "E-mail de reset enviado, verifique sua caixa de E-mail!")
            res.redirect("/forgot")
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/login")
        }
    }

    private async getVerifyReset(req: Request, res: Response): Promise<void> {
        try{
            const user: IUser = await this._bankMethodUser.processVerifyReset(String(req.query.token))
            res.render("admin/users/new-password", {user: user, email: user.email, error: req.flash("error"), success: req.flash("success")})
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/login")
        }
    }

    private async postAuthPassword(req: Request, res: Response): Promise<void> {
        try{
            await this._bankMethodUser.processVerifyPassword(req.body.email, req.body.password)
            res.locals.message = req.flash("success", "Senha alterada com sucesso!!")
            res.redirect("/login")
        } catch(e) {
            res.locals.message = req.flash("error", `${e}`)
            res.redirect("/login")
        }
    }

    private async getLogout(req: Request, res: Response): Promise<void> {
        req.session.login = undefined
        res.clearCookie("token")
        res.redirect("/login")
    }
}