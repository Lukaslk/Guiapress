const mongoose = require("mongoose")
const conn = require('../../database/database')

const Category = mongoose.model('Category', {
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    }
})

module.exports = Category