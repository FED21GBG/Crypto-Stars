const bcrypt = require('bcryptjs')
const saltRounds = 10

//hashar vår lösenord 
async function hashPassword(password){
const hashedPassword = await bcrypt.hash(password, saltRounds)
return hashedPassword
}



module.exports={hashPassword}