class ArticleNotFound extends Error {
    constructor () {
        super()
        this.name = `Article not found`
        this.idErro = 9
    }
}

module.exports = ArticleNotFound