class EmailAlreadyUse extends Error {
    constructor () {
        super()
        this.name = 'E-mail already in use'
        this.idErro = 1
    }
}

module.exports = EmailAlreadyUse