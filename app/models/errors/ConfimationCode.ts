export class ConfimationCode extends Error {
    constructor () {
        super()
        this.name = 'Confimation Code expire or not exist'
    }
}