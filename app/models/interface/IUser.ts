import { Document } from 'mongoose';
import { Status } from '../Enum/Status.js'

export interface IUser extends Document {
  email: String,
  password: String,
  status: {
    type: Status, 
    enum: Status,
    default: Status.Pending
  },
  confirmationCode: String,
  confirmationResetCode: String
};