const mongoose = require("mongoose")

const conn = mongoose.connect("mongodb://127.0.0.1:27017/task-manager", {
    useNewUrlParser: true,
    useCreateIndex: true
})

module.exports = conn 