class WrongPassword extends Error {
    constructor () {
        super()
        this.name = 'Password is wrong, try again!'
        this.idErro = 6
    }
}

module.exports = WrongPassword