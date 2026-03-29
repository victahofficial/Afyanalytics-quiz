const express = require('express')
const prisma = require('../lib/prisma')
const { requireAuth, requireRole } = require('../middleware/authMiddleware')
const { sendEmail } = require('../services/emailService')
const { sendSms } = require('../services/smsService')

const router = express.Router()

router.get('/', requireAuth, requireRole('leader', 'admin'), async (_, res) => {
    const notices = await prisma.meetingNotice.findMany({
        include: {
            createdBy: {
                select: {
                    id: true,
                    fullName: true,
                    role: true,
                },
            },
            recipients: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    res.json(notices)
})

router.post('/', requireAuth, requireRole('leader', 'admin'), async (req, res) => {
    const {
        title,
        message,
        type,
        meetingDate,
        sendEmail: doEmail,
        sendSms: doSms,
        userIds,
    } = req.body

    if (!title || !message || !type) {
        return res.status(400).json({ message: 'title, message, and type are required' })
    }

    let recipients = []

    if (Array.isArray(userIds) && userIds.length > 0) {
        recipients = userIds.map((userId) => ({ userId: Number(userId) }))
    } else {
        const users = await prisma.user.findMany({
            where: { isActive: true },
            select: { id: true },
        })
        recipients = users.map((user) => ({ userId: user.id }))
    }

    const notice = await prisma.meetingNotice.create({
        data: {
            title,
            message,
            type,
            meetingDate: meetingDate ? new Date(meetingDate) : null,
            sendEmail: !!doEmail,
            sendSms: !!doSms,
            createdById: req.user.id,
            recipients: {
                create: recipients,
            },
        },
        include: {
            recipients: true,
        },
    })

    res.status(201).json(notice)
})

router.post('/:id/send', requireAuth, requireRole('leader', 'admin'), async (req, res) => {
    const notice = await prisma.meetingNotice.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            recipients: {
                include: {
                    user: true,
                },
            },
        },
    })

    if (!notice) {
        return res.status(404).json({ message: 'Notice not found' })
    }

    for (const recipient of notice.recipients) {
        if (notice.sendEmail && recipient.user.email) {
            await sendEmail({
                to: recipient.user.email,
                subject: notice.title,
                text: notice.message,
            })

            await prisma.noticeRecipient.update({
                where: { id: recipient.id },
                data: {
                    sentEmail: true,
                    emailSentAt: new Date(),
                },
            })
        }

        if (notice.sendSms && recipient.user.phone) {
            await sendSms({
                to: recipient.user.phone,
                body: notice.message,
            })

            await prisma.noticeRecipient.update({
                where: { id: recipient.id },
                data: {
                    sentSms: true,
                    smsSentAt: new Date(),
                },
            })
        }
    }

    res.json({ message: 'Notice sending completed' })
})

module.exports = router