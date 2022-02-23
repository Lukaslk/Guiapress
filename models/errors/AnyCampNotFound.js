class AnyCampNotFound extends Error {
    constructor (field) {
        super()
        this.name = `The field '${field}' is invalid`
        this.idErro = 7
    }
}

module.exports = AnyCampNotFound