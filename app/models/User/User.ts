import { Schema,  model, Model } from 'mongoose'
import { IUser } from '../interface/IUser.js'
import { sign } from 'jsonwebtoken'
import { genSaltSync, hashSync, compareSync } from 'bcrypt'
import { Status } from '../Enum/Status.js'
import { emailNotRegistered } from '../errors/emailNotRegistered.js' 
import { EmailAlreadyUse } from '../errors/EmailAlreadyUse.js' 
import { ConfimationCode } from '../errors/ConfimationCode.js' 
import { AccountInative } from '../errors/AccountInative.js' 
import { WrongPassword } from '../errors/WrongPassword.js' 
import { RefreshToken } from '../errors/RefreshToken.js' 
import { IBankMethodUser } from '../interface/IBankMethodUser.js'
import { Email } from '../Email/Email.js'
import { IEmail } from '../interface/IEmail.js'
import { container } from 'tsyringe'
require("dotenv").config()

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
  },
  status: {
    type: Status, 
    enum: Status,
    default: Status.Pending
  },
  confirmationCode: { 
    type: String, 
    unique: true
  },
  confirmationResetCode: {
    type: String,
    unique: true
  }
})

export const User = model('User', userSchema)

export class BankMethodUser implements IBankMethodUser {
  private _email: IEmail
  private _user: Model<IUser, any, any>

  constructor() {
    this._email = container.resolve(Email)
    this._user = User
  }

  public async insert(email: string, password: string): Promise<IUser> {
    const result: IUser = await this._user.findOne({email: email })
    if(result) throw new EmailAlreadyUse()
    if(!result || result == null){
        const token: string = sign({ email: email }, process.env.JWTSECRET,{ expiresIn:'30m' })
        const passToken: string = sign({ email: email }, process.env.JWTSECRET,{ expiresIn:'30m' })

        let salt = genSaltSync(10)
        let hash: string = hashSync(password, salt)

        let newUser = new this._user({
            email: email,
            password: hash,
            token: token,
            confirmationCode: token,
            confirmationResetCode: passToken
        })

        await this._email.Send(newUser.email, token)
        await newUser.save()
        return newUser
      }
  }

  public async verify(reqToken: String): Promise<IUser> {
      const user: IUser =  await this._user.findOne({confirmationCode: reqToken})
      if(!user) throw new ConfimationCode()
      user.set({ status: Status.Active})
      await user.save()
      return user
  }

  async verifyRefreshToken(email: String): Promise<IUser> {
      const user =  await this._user.findOne({ email: email})
      if(!user) throw new RefreshToken()
      const token: string = sign({ email: email }, process.env.JWTSECRET, { expiresIn:'30m' })

      await this._email.Send(user.email, token)
      
      user.confirmationCode = token
      await user.save()

      return user
  }

  async verifyAuthenticate(email: String, password: String): Promise<string> {
      const user: IUser =  await this._user.findOne({email: email})
      if(!user) throw new emailNotRegistered()
      if (user.status as unknown as Status != Status.Active) throw new AccountInative()

      let correct = compareSync(password, user.password) 
      
      if(!correct) throw new WrongPassword()
      const token: string = await sign({id: user.id, email: user.email},process.env.JWTSECRET,{expiresIn:'1d'})
      return token
  }
  
  async processReset(email: String): Promise<IUser> {
      const user: IUser =  await this._user.findOne({email: email})
      if(!user) throw new emailNotRegistered()
      const passToken = sign({email: email},process.env.JWTSCRETRESET,{expiresIn:'30m'})

      await this._email.redefinePassword(user.email as string, passToken)

      user.confirmationResetCode = passToken
      user.save()

      return user
  }

  async processVerifyReset(verifyReset: String): Promise<IUser> {
      const user: IUser = await this._user.findOne({confirmationResetCode: verifyReset})
      if(!user) throw new RefreshToken()
      return user
  }

  async processVerifyPassword(email: String, pass: String): Promise<IUser> {
      const user: IUser = await this._user.findOne({email: email})
      if(!user) throw new emailNotRegistered()
      let password: String = pass
      let salt = genSaltSync(10)
      let hash = hashSync(password, salt)
      user.password = hash
      user.save()
      
      return user
  }
}