const BankMethod = require('./BankMethod')
const AnyCampNotFound = require('../Errors/AnyCampNotFound')

class Production {
    constructor({ id, title, slug, body, categoryId, category }) {
        this.id = id
        this.title = title
        this.slug = slug
        this.body = body
        this.categoryId = categoryId
        this.category = category
    }

    async createArticle() {
        this.validation()
        const result = await BankMethod.create({
            title: this.title,
            slug: this.slug,
            body: this.body,
            categoryId: this.categoryId
        })
        console.log(result)
        this.id = result.id
    }

    async searchIdAndDelete(){
        const found = await BankMethod.delete(this.id)
        this.id = found.id
    }

    async searchIdAndEdit(){
        const found = await BankMethod.edit(this.id)
        this.id = found.article.id
        this.title = found.article.title
        this.slug = found.article.slug
        this.body = found.article.body
        this.categoryId = found.article.categoryId
        {
            this.category = found.categories
        }
    }

    async updateById(){
        const found = await BankMethod.update(this.id, this.title, this.body, this.categoryId, this.slug)
        this.id = found.id
        this.title = found.title
        this.slug = found.slug
        this.body = found.body
        this.categoryId = found.categoryId
    }

    validation () {
        const fields =  ['title', 'body', 'categoryId']

        fields.forEach(field => {
            const value = this[field]

            if(typeof value !== 'string' || value.length === 0) {
                throw new AnyCampNotFound(field)
            }
        })
    }
}

module.exports = Production