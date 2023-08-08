export class RefreshToken extends Error {
    constructor () {
        super()
        this.name = 'Token expire or not exist'
    }
}