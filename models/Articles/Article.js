const conn = require('../../database/database')
const mongoose = require("mongoose")

const Article = mongoose.model('Article', {
    title: {
        type: String,
        allowNull: false
    },
    slug: {
        type: String,
        allowNull: false
    },
    body: {
        type: String,
        allowNull: false
    },
    categoryId: {}
})
module.exports = Article