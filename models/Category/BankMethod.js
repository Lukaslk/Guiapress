const Article = require('../Articles/Article')
const Category = require('./Category')

module.exports = {
    async getAll(){
        const categories = await Category.find()
        return categories
    }
}