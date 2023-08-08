export class AccountInative extends Error {
    constructor () {
        super()
        this.name = 'Account Pending Activation, please check your E-mail!'
    }
}