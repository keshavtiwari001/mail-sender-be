const cron = require('node-cron')
const Email = require('../models/Email')
const { sendAndMarkResult } = require('../services/emailQueue')

async function processDueEmails() {
  const due = await Email.find({
    status: 'pending',
    scheduledAt: { $lte: new Date() },
  }).sort({ scheduledAt: 1 })

  for (const email of due) {
    await sendAndMarkResult(email)
  }
}

function startEmailCron() {
  cron.schedule('* * * * *', processDueEmails)
  console.log('Email cron started (checks every minute)')
}

module.exports = startEmailCron
module.exports.processDueEmails = processDueEmails
