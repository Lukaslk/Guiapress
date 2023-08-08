export class ErrorCanDelete extends Error {
    constructor (reason: string) {
        super()
        this.name = `Category cannot be ${reason} because it is linked to an article`
    }
}