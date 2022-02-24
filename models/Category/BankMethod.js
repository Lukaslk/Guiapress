const Article = require('../Articles/Article')
const Category = require('./Category')
const CategoryNotFound = require('../Errors/CategoryNotFound')
const IdNotFound = require('../Errors/IdNotFound')
const slugify = require('slugify')

module.exports = {
    async getAll(){
        const categories = await Category.find()
        return categories
    },
    async create(info) {
    let category = new Category({
        title: info.title,
        slug: slugify(info.title)
    })
    category.save()

    return category
    },
    async edit(id){
        const categories = await Category.findOne({ _id: id})
        if(!categories) {
            throw new CategoryNotFound()
        }
        return {categories}
    },
    async update(id, title) {
        const found = await Category.findByIdAndUpdate(id, {title: title, slug: slugify(title)})
        if(!found) {
            throw new IdNotFound()
        }
        return found
    },
    async delete(id) {
        const found = await Category.findByIdAndDelete({ _id: id })

        if(!found) {
            throw new IdNotFound()
        }
        return found
    }
}