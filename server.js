require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const startEmailCron = require('./jobs/emailCron')
const { initAdminAuth } = require('./services/adminAuth')
const requireAuth = require('./middleware/auth')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/email', requireAuth, require('./routes/emailRoutes'))

const PORT = process.env.PORT || 5000

Promise.all([connectDB(), initAdminAuth()])
  .then(() => {
    startEmailCron()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Startup failed:', err.message)
    process.exit(1)
  })
