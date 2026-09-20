require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const startEmailCron = require('./jobs/emailCron')
const { initAdminAuth } = require('./services/adminAuth')
const requireAuth = require('./middleware/auth')

const app = express()

const allowedOrigins = [
  'https://mail-sender-fe-chi.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Origin not allowed by CORS'))
  },
}))
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
