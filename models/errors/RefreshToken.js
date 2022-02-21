class RefreshToken extends Error {
    constructor () {
        super()
        this.name = 'Token expire or not exist'
        this.idErro = 3
    }
}

module.exports = RefreshToken