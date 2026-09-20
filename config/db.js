// const mongoose = require('mongoose')

// async function connectDB() {
//   await mongoose.connect(process.env.MONGO_URI)
//   console.log('MongoDB connected')
// }

// module.exports = connectDB

const mongoose = require('mongoose')

async function connectDB() {
  try {
    // Mongoose 6+ ke baad options ki zaroorat nahi padti kyunki naye parser aur engine by default enabled hote hain.
    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    // Agar database connect na ho, toh app ko exit karna hi behtar hai taaki server faulty state mein na chale
    process.exit(1)
  }
}

// Optional: Connection events ko monitor karne ke liye
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected! Attempting to reconnect...')
})

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`)
})

module.exports = connectDB