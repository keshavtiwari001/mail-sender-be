const express = require('express')
const jwt = require('jsonwebtoken')
const { verifyAdminCredentials } = require('../services/adminAuth')

const router = express.Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const isValid = await verifyAdminCredentials(email, password)

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' })
  res.json({ token })
})

module.exports = router
