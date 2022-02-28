const Article = require('../Articles/Article')
const Category = require('../Category/Category')

module.exports = {
    async getAll(){
        const categories = await Category.find()
        const articles = await Article.find()

        return { articles, categories}
    }
}