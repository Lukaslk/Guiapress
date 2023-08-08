import "reflect-metadata"
import { model, Schema } from 'mongoose';
import { IArticle } from '../interface/IArticle.js'
import {ArticleNotFound} from '../errors/ArticleNotFound.js'
import {IdNotFound} from '../errors/IdNotFound.js'
import slugify from 'slugify'
import { IBankMethodArticle } from '../interface/IBankMethodArticle.js';
import { Validation } from "../../resources/Validation.js";
import { IValidation } from "../interface/iValidation.js";
import { container } from "tsyringe";
import jwt from 'jsonwebtoken'

const ArticleModel = new Schema<IArticle>({
    title: {
        type: String,
        allowNull: false
    },
    slug: {
        type: String,
        allowNull: false
    },
    body: {
        type: String,
        allowNull: false
    },
    idUser: { type: Schema.Types.ObjectId, ref: 'User' },
    categoryId: String
})

const Article = model("Article", ArticleModel)

class BankMethodArticle implements IBankMethodArticle {
    public async getAll(): Promise<IArticle[]>{
        const articles: IArticle[] = await Article.find()
        return articles
    }

    public async getAllById(idUser: String): Promise<IArticle[]>{
        let user = jwt.verify(idUser, process.env.JWTSECRET)
        const articles: IArticle[] = await Article.find({idUser: user.id})
        return articles
    }

    public async findArticleByCategoryId(item: string): Promise<IArticle>{
        const article: IArticle = await Article.findOne({categoryId: item})
        return article
    }

    public async getById(id: string): Promise<IArticle>{
        return await Article.findById(id)
    }

    public async create(title: string, body: string, idCategory: string, login: string): Promise<void> {
        let user = jwt.verify(login, process.env.JWTSECRET)
        const validation: IValidation = container.resolve(Validation)
        validation.validationFields([title, body, idCategory])
        let article: IArticle = new Article({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: idCategory,
            idUser: user.id
        })
        await article.save()
    }

    public async edit(id: String): Promise<IArticle>{
        const article: IArticle = await Article.findOne({ _id: id })
        if(!article) throw new ArticleNotFound()
        return article
    }

    public async update(id: string, title: string, body: string, category: any): Promise<IArticle> {
        const found: IArticle = 
        await Article.findByIdAndUpdate(id, 
            {title: title, 
                body: body, 
                categoryId: category, 
                slug: slugify(title) 
            })
        if(!found) throw new IdNotFound()
        return found
    }

    public async pagination(pageString: string): Promise<{
        result: {
            page: number,
            next: boolean,
            articles: IArticle[]
        }
    }> {
        let page: number = parseInt(pageString)
        let query = {};
        let offset: number = 0
        let limit: number = 4;
        let skip: number = limit * page;
        let next: boolean

        const articles: IArticle[] = await Article.find(query)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)

        if(isNaN(page) || page == 1) offset = 0
        else offset = page * 4

        const art: IArticle[] = await Article.find(query)
        let count = art.length

        if(offset + 4 > count) next = false
        else next = true  

        let result: {
            page: number,
            next: boolean,
            articles: IArticle[]
        } = { 
            page: page,
            next: next, 
            articles: articles
        }  
        return { result }
    }

    async delete(id: String): Promise<void> {
        const found: IArticle = await Article.findByIdAndDelete({ _id: id })
        if(!found) throw new IdNotFound()
    }
}

export {BankMethodArticle};