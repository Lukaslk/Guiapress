class ConfimationCode extends Error {
    constructor () {
        super()
        this.name = 'Confimation Code expire or not exist'
        this.idErro = 2
    }
}

module.exports = ConfimationCode