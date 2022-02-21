const BankMethod = require('./BankMethod')

class Production {
    constructor({ id, email, password, token, confirmationCode, confirmationResetCode }) {
        this.id = id
        this.email = email
        this.password = password
        this.token = token
        this.confirmationCode = confirmationCode
        this.confirmationResetCode = confirmationResetCode
    }

    async createUser() {
        const result = await BankMethod.insert({
            email: this.email,
            password: this.password,
            token: this.token,
            confirmationCode: this.confirmationCode,
            confirmationResetCode: this.confirmationResetCode
        })
        this.id = result.id
    }

    async confirmationCodeUser() {
        const found = await BankMethod.verify(this.confirmationCode)
        this.id = found.id
        this.email = found.email
        this.password = found.password
        this.confirmationCode = found.confirmationCode
    }

    async refreshTokenConfirmation() {
        const found = await BankMethod.verifyRefreshToken(this.email)
        this.id = found.id
        this.email = found.email
        this.password = found.password
        this.confirmationCode = found.confirmationCode
    }

    async authenticate() {
        const found = await BankMethod.verifyAuthenticate(this.email, this.password)
        this.token = found
    }

    async reset() {
        const found = await BankMethod.processReset(this.email)
        this.id = found.id
        this.email = found.email
        this.password = found.password
        this.confirmationResetCode = found.confirmationResetCode
    }

    async verifyReset() {
        const found = await BankMethod.processVerifyReset(this.confirmationResetCode)
        this.id = found.id
        this.email = found.email
        this.password = found.password
        this.confirmationResetCode = found.confirmationResetCode
    }

    async authPassword() {
        const found = await BankMethod.processVerifyPassword(this.email, this.password)
        this.id = found.id
        this.email = found.email
        this.password = found.password
    }
}

module.exports = Production