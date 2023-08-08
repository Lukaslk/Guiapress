export class IdNotFound extends Error {
    constructor () {
        super()
        this.name = 'Id not found!'
    }
}