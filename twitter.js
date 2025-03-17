const request = require("node-superfetch")
const  bearer = "AAAAAAAAAAAAAAAAAAAAAGZwvAEAAAAAbDrj6ojlZjymRt2Z5kutREhlW5U%3D0euxCweU68JlX6OKDdmRNErQSg63RHXWuLGueWwoclpIzj52FG"
const bearer2 = "1818231516784398336-rczF5w8wKz8SBL6TPt4DRumZYL7FCI"
const axios = require("axios")
async function users(users) {
  if(!users) throw Error("Provide your twitter name")
  let Data = await axios.get("https://api.x.com/1.1/users/show.json?screen_name="+users, {
    headers: {
      
    "Authorization": `Bearer ${bearer}`
    },
  })
  //let data = await request.get("https://api.x.com/1.1/users/show.json?screen_name="+users)
  //.set({Authorization: `Bearer ${bearer}`})
  return Data.body;
};

module.exports = { users }