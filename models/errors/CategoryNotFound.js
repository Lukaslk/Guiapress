class CategoryNotFound extends Error {
    constructor () {
        super()
        this.name = `Category not found`
        this.idErro = 10
    }
}

module.exports = CategoryNotFound