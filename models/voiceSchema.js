const { Schema, model } = require('mongoose')

let msg = new Schema({
  guild: String,
  channel: String,
  category: Number,
  userLimit: Number
})

module.exports = model('voiceSchema', msg)