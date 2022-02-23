class IdNotFound extends Error {
    constructor () {
        super()
        this.name = 'Id not found!'
        this.idErro = 8
    }
}

module.exports = IdNotFound