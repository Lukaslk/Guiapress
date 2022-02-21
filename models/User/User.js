const mongoose = require("mongoose")
//const jwt = require('jsonwebtoken')
//const conn = require("../../database/database")
require("dotenv").config()

const userSchema = new mongoose.Schema({
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
        type: String, 
        enum: ['Pending', 'Active'],
        default: 'Pending'
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

const User = mongoose.model('User', userSchema)

module.exports = User