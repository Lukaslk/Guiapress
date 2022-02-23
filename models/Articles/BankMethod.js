const Article = require('./Article')
const Category = require('../Category/Category')
const IdNotFound = require('../Errors/IdNotFound')
const ArticleNotFound = require('../Errors/ArticleNotFound')
const slugify = require('slugify')

module.exports = {
    async getAll(){
        const categories = await Category.find()
        const articles = await Article.find()

        return { articles, categories}
    },
    async create(info) {
        let article = new Article({
            title: info.title,
            slug: slugify(info.title),
            body: info.body,
            categoryId: info.categoryId
        })
        article.save()

        return article
    },
    async edit(id){
        const article = await Article.findOne({ _id: id })
        const categories = await Category.find()
        if(!article) {
            throw new ArticleNotFound()
        }

        return { article, categories }
    },
    async update(id, title, body, category) {
        const found = await Article.findByIdAndUpdate(id, {title: title, body: body, 
            categoryId: category, slug: slugify(title) })
        if(!found) {
            throw new IdNotFound()
        }
        return found
    },
    async pagination(p) {
        let page = parseInt(p)
        let query = {};
        let offset = 0
        let limit = 4;
        let skip = limit * page;

        const categories = await Category.find()
        const articles = await Article.find(query)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)

        if(isNaN(page) || page == 1) {
            offset = 0
        } else {
            offset = parseInt(page) * 4
        }

        const art = await Article.find(query)
        let count = art.length

        if(offset + 4 > count) {
            next = false
        } else {
            next = true
        }        

        let result = { 
            page: parseInt(page),
            next: next, 
            articles: articles
        }  
        return { result, categories }
    },
    async paginationNotLoggeIn(p) {
        let page = parseInt(p)
        let query = {};
        let offset = 0
        let limit = 4;
        let skip = limit * page;

        const categories = await Category.find()
        const articles = await Article.find(query)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)

        if(isNaN(page) || page == 1) {
            offset = 0
        } else {
            offset = parseInt(page) * 4
        }

        const art = await Article.find(query)
        let count = art.length

        if(offset + 4 > count) {
            next = false
        } else {
            next = true
        }        

        let result = { 
            page: parseInt(page),
            next: next, 
            articles: articles
        }  
        return { result, categories }
    },
    async delete(id) {
        const found = await Article.findByIdAndDelete({ _id: id })

        if(!found) {
            throw new IdNotFound()
        }
        return found
    }
}