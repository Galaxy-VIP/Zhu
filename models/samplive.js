const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  guild: String,
  channel: String
})

module.exports = mongoose.model('samplive', Schema)