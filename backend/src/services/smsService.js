async function sendSms({ to, body }) {
    console.log('SMS placeholder:', { to, body })
    return { ok: true, skipped: true }
}

module.exports = { sendSms }