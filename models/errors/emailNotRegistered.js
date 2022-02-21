class emailNotRegistered extends Error {
    constructor () {
        super()
        this.name = 'Email not registered'
        this.idErro = 4
    }
}

module.exports = emailNotRegistered