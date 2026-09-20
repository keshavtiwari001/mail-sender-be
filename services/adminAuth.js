const bcrypt = require('bcryptjs')

let hashedPassword = null

async function initAdminAuth() {
  hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
}

async function verifyAdminCredentials(email, password) {
  if (email !== process.env.ADMIN_EMAIL) return false
  if (!hashedPassword) return false
  return bcrypt.compare(password, hashedPassword)
}

module.exports = { initAdminAuth, verifyAdminCredentials }
