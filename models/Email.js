const mongoose = require('mongoose')

const emailSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Email', emailSchema)
