const { model, Schema } = require("mongoose");
 
const schema = new Schema({
    guild: String,
    channel: String
});
 
module.exports = model("auditlogs", schema)