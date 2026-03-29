const nodemailer = require('nodemailer')

function hasMailConfig() {
    return (
        process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS &&
        process.env.MAIL_FROM
    )
}

async function sendEmail({ to, subject, text, html }) {
    if (!hasMailConfig()) {
        console.log('Email skipped: SMTP config missing', { to, subject })
        return { skipped: true }
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    return transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text,
        html,
    })
}

module.exports = { sendEmail }