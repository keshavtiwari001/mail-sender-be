const Email = require('../models/Email')
const { sendApplicationEmail } = require('./mailer')
const parseEmails = require('../utils/parseEmails')
const { EMAIL_BODY } = require('../config/emailTemplate')

async function sendAndMarkResult(emailDoc) {
  try {
    await sendApplicationEmail(emailDoc.to, emailDoc.body)

    emailDoc.status = 'success'
    await emailDoc.save()

    return true
  } catch (err) {
    console.error(`Failed to send to ${emailDoc.to}:`, err)

    emailDoc.status = 'failed'
    await emailDoc.save()

    return false
  }
}


async function queueEmails(rawTo) {
  const { valid, invalid } = parseEmails(rawTo)

  if (valid.length === 0) {
    return { queued: [], rejected: invalid }
  }

  const delayMs = Number(process.env.EMAIL_DELAY_MINUTES || 7) * 60 * 1000
  const [first, ...rest] = valid

  const firstDoc = await Email.create({
    to: first,
    body: EMAIL_BODY,
    status: 'pending',
    scheduledAt: new Date(),
  })
  await sendAndMarkResult(firstDoc)

  const laterDocs = rest.length
    ? await Email.insertMany(
        rest.map((email, i) => ({
          to: email,
          body: EMAIL_BODY,
          status: 'pending',
          scheduledAt: new Date(Date.now() + (i + 1) * delayMs),
        }))
      )
    : []

  return {
    sent: firstDoc.status === 'success'
      ? [{
          to: firstDoc.to,
          status: firstDoc.status,
          scheduledAt: firstDoc.scheduledAt,
        }]
      : [],
    queued: [firstDoc, ...laterDocs].filter((doc) => doc.status === 'pending').map((doc) => ({
      to: doc.to,
      status: doc.status,
      scheduledAt: doc.scheduledAt,
    })),
    rejected: invalid,
  }
}

module.exports = { queueEmails, sendAndMarkResult }
