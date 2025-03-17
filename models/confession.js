const { Schema, model } = require('mongoose')

let msg = new Schema({
  guild: String,
  channel: String,
  confession: Number,
  confessionCooldown: Number
})

module.exports = model('confess', msg)