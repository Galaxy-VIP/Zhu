const axios = require("axios")
const sesi2 = "SqLzLC9AzLwHYeOAjxwsX0j2go2LcRhi"
const sesi3 = "57001488958:kAhnHht9D92BBz:26:AYdRiupstCVgBRwlPPsa5ix-wX6Nt01o1bbNA5blRw"
const sesi4 = 'ig_did=5B6C959B-47AF-4FBD-890A-301F301FE7DC; ig_nrcb=1; mid=YBKmnwABAAG3_83eWlCrSM5jmZNC; fbm_124024574287414=base_domain=.instagram.com; csrftoken=e48sCPnhJE7ipTRgepri6caAxmaMlQs0; mid=YBKmnwABAAG3_83eWlCrSM5jmZNC; fbsr_124024574287414=gtWYRg2ZzkTptCGK1CRnE5-aWUjgXLMwNwVf6qtgE3c.eyJ1c2VyX2lkIjoiMTAwMDQxNDg5ODA4NDE5IiwiY29kZSI6IkFRQUE2UVJLMFR3TWFLYVJpbkhCRGowZE81MlZVNUw2bkdaS3dtR3dwSFZtQTdJQUpnUW9MQU52WW1NVElBa3B2bkRRR0RYQVZObVViaTcxa21MUG83UDNRa0U5SWhJNVJTLUE1TkRiS1N2OVM5NUFGUjVlSnNqaXc4Q3oxdkx5TkR3blRLUmJSTkx3MTEwanpBc29tTGh1d2hJbUNWRUZ4UVlJcnRnM3piRVd5TGMxMjlBdGN4Um5ERG5QQTVacl8xQkVkRFA2VmdfVE1KcFhVZlBvb0hkR2xKU1FldVB4cGZmbUJZcVViNEYwX1JWdGZfaEVBN05OTGFaQ2EzYkpZRWlJTjdKRF9iSHo4TmNfSG5QcFVkejJhVGVtN3B5YzM0bE1fTnFoUk9oc1hKclpqanhwZWY2bk9WenM4OWVIX25VbGM5MnFGYUJoVlhmWG5oV2RuZldKIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUtubWQzaHk4U2MybmJxTldqNm9SZklmdXpTVkNzakY2MnhidmdaQ05XNDV3dzNVT2lNTWppczFOVnFvTTZKWFJSdkRhOWVoZE8xWkNvVzJBWkNBdzE1SDB4YXI3VjNNYVJlMTh6MnJqREpFWWI4d2ZJdFBYSFRmRHBzRUV1RDRZZm9QMkdpWkNoQkNtWWVPZjgybW84UjRZdXdlNHo1a0FnUkIwRG9TIiwiYWxnb3JpdGhtIjoiSE1BQy1TSEEyNTYiLCJpc3N1ZWRfYXQiOjE2MTE4MzUwNjh9; urlgen={"115.178.192.84": 18004}:1l575M:QMEb-cN9p6hK2T9DHHTwzXF6Gn8'
const sesi5 = '38757547677%3AxwfACv88ELH3sV%3A22'
async function user(user) {
  if(!user) throw Error("Provide your instagram name")
  let data = await axios.get(`https://instagram.com/${user}/?__a=1&__d=dis`, { headers: { cookie: `sessionid=${sesi5}` }})
  console.log(data)
  return data.data.graphql.user;
}

module.exports = { user }