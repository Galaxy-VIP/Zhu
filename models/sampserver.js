const mongoose = require("mongoose")

let Schema = new mongoose.Schema({
  guild: String,
  ip: String,
  port: String,
  status: String
})
module.exports = mongoose.model("sampserver", Schema)