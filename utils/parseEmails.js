const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function parseEmails(raw) {
  const seen = new Set()
  const valid = []
  const invalid = []

  raw
    .split(',')
    .map((email) => email.trim())
    .filter((email) => email.length > 0)
    .forEach((email) => {
      const key = email.toLowerCase()
      if (seen.has(key)) return
      seen.add(key)

      if (EMAIL_REGEX.test(email)) {
        valid.push(email)
      } else {
        invalid.push(email)
      }
    })

  return { valid, invalid }
}

module.exports = parseEmails
