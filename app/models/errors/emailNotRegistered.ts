export class emailNotRegistered extends Error {
    constructor () {
        super()
        this.name = 'Email not registered'
    }
}