const mongoose = require("mongoose")

const voiceSchema = new mongoose.Schema({
    guild: String,
    channel: String,
})

module.exports = mongoose.model("voicePanel", voiceSchema)