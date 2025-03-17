const mongoose = require("mongoose")

let voice = new mongoose.Schema({
    user: String,
    channel: String,
    userLimit: Number
})

module.exports = mongoose.model("voice", voice)