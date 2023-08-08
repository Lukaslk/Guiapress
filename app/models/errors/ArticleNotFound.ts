export class ArticleNotFound extends Error {
    private _idErro: number
    constructor () {
        super()
        this.name = `Article not found`
        this._idErro = 9
    }
}