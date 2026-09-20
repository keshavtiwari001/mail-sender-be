const nodemailer = require('nodemailer')
const { EMAIL_BODY, EMAIL_SUBJECT } = require('../config/emailTemplate')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function toHtml(body) {
  return escapeHtml(body)
    .replace(/\[([^\]]+)\]\((mailto:[^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\r?\n/g, '<br>')
}

async function sendApplicationEmail(to, body = EMAIL_BODY) {
  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    bcc: process.env.BCC_EMAILS || undefined,
    subject: EMAIL_SUBJECT,
    text: body,
    html: toHtml(body),
    attachments: [
      {
        filename: 'resume.pdf',
        path: process.env.RESUME_PATH,
      },
    ],
  })
}

module.exports = { sendApplicationEmail }
