const express = require('express')
const { queueEmails } = require('../services/emailQueue')

const router = express.Router()

router.post('/send', async (req, res) => {
  const { to } = req.body

  if (!to || typeof to !== 'string') {
    return res.status(400).json({ error: 'to is required and must be a string' })
  }

  try {
    const result = await queueEmails(to)

    if (result.sent.length === 0 && result.queued.length === 0) {
      return res.status(400).json({ error: 'No valid emails provided', rejected: result.rejected })
    }

    res.json(result)
  } catch (err) {
    console.error('Queue failed:', err.message)
    res.status(500).json({ error: 'Failed to queue emails' })
  }
})

module.exports = router
