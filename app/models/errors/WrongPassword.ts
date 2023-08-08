export class WrongPassword extends Error {
    constructor () {
        super()
        this.name = 'Password is wrong, try again!'
    }
}