const bcrypt = require("bcryptjs");
const saltRounds = 10;

//hashar vår lösenord
async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
//kollar om den är samma hashe lösen
async function comparePassword(password, hash) {
  const samePassword = await bcrypt.compare(password, hash);
  return samePassword;
}

module.exports = { hashPassword, comparePassword };
