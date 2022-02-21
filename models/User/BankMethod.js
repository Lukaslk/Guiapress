const User = require("./User")
const EmailAlreadyUse = require('../errors/EmailAlreadyUse')
const ConfimationCode = require('../errors/ConfimationCode')
const RefreshToken = require('../errors/RefreshToken')
const emailNotRegistered = require('../errors/emailNotRegistered')
const AccountInative = require('../errors/AccountInative')
const WrongPassword = require('../errors/WrongPassword')
const sendEmail = require("../Email/sendEmail")
const refreshEmail = require("../Email/refreshEmail")
const redefinePassword = require("../Email/redefinePassword")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    async insert(user) {
        const result = await User.findOne({ where: {email: user.email }})
        if(result) {
            throw new EmailAlreadyUse()
        }
        if(!result || result == null){
            const token = jwt.sign(
                {email: user.email},process.env.JWTSECRET,{expiresIn:'30m'})
            const passToken = jwt.sign(
                {email: user.email},process.env.JWTSECRET,{expiresIn:'30m'})

            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(user.password, salt)

            let newUser = new User({
                email: user.email,
                password: hash,
                token: token,
                confirmationCode: token,
                confirmationResetCode: passToken
            })
            await sendEmail(user.email, token)

            return newUser.save()
        }
    },
    async verify(reqToken) {
        const user =  await User.findOne({confirmationCode: reqToken})
        if(!user){
            throw new ConfimationCode()
        }
        user.status = "Active"
        user.save()
        return user
    },
    async verifyRefreshToken(email) {
        const user =  await User.findOne({email: email})
        if(!user){
            throw new RefreshToken()
        }
        const token = jwt.sign(
            {email: email},process.env.JWTSECRET,{expiresIn:'30m'})

        await refreshEmail(user.email, token)

        user.confirmationCode = token
        user.save()

        return user
    },
    async verifyAuthenticate(email, password) {
        const user =  await User.findOne({email: email})
        if(!user) {
            throw new emailNotRegistered()
         }
        
        if (user.status != "Active") {
            throw new AccountInative()
        }

        let correct = bcrypt.compareSync(password, user.password) 
        
        if(!correct) {                
            throw new WrongPassword()
        }
        const token = jwt.sign({id: user.id, email: user.email},process.env.JWTSECRET,{expiresIn:'1d'})
        return token
    },
    async processReset(email) {
        const user =  await User.findOne({email: email})
        if(!user) {
            throw new emailNotRegistered()
        }
        const passToken = jwt.sign(
            {email: email},process.env.JWTSCRETRESET,{expiresIn:'30m'})
        
        await redefinePassword(user.email, passToken)

        user.confirmationResetCode = passToken
        user.save()

        return user
    },
    async processVerifyReset(verifyReset) {
        const user = await User.findOne({confirmationResetCode: verifyReset})
        if(!user) {
            throw new RefreshToken()
        }
        return user
    },
    async processVerifyPassword(email, pass) {
        const user = await User.findOne({email: email})
        if(!user) {
            throw new emailNotRegistered()
        }
        let password = pass
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(password, salt)
        user.confirmationResetCode = null
        user.password = hash
        user.save()
        
        return user
    }
}