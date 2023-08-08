export class EmailAlreadyUse extends Error {
    constructor () {
        super()
        this.name = 'E-mail already in use'
    }
}