export class CategoryNotFound extends Error {
    constructor () {
        super()
        this.name = `Category not found`
    }
}