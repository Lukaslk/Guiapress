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

    async createCategory() {
        this.validation()
        const result = await BankMethod.create({
            title: this.title,
            slug: this.slug
        })
        this.id = result.id
    }

    async searchIdAndEdit(){
        const found = await BankMethod.edit(this.id)
        this.id = found.categories.id
        this.title = found.categories.title
        this.slug = found.categories.slug
    }

    async searchIdAndDelete(){
        const found = await BankMethod.delete(this.id)
        this.id = found.id
    }

    async updateById(){
        const found = await BankMethod.update(this.id, this.title)
        this.id = found.id
        this.title = found.title
        this.slug = found.slug
    }

    validation () {
        const fields =  ['title']

        fields.forEach(field => {
            const value = this[field]

            if(typeof value !== 'string' || value.length === 0) {
                throw new AnyCampNotFound(field)
            }
        })
    }
}

module.exports = Production