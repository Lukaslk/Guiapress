export class AnyCampNotFound extends Error {
    private _idErro: number
    constructor (field: string) {
        super()
        this.name = `The field '${field}' is invalid`
        this._idErro = 7
    }
}