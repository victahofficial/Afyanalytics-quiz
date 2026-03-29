const express = require('express')
const prisma = require('../lib/prisma')
const { requireAuth, requireRole } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', async (_, res) => {
    const posts = await prisma.post.findMany({
        where: { status: 'approved' },
        include: {
            author: {
                select: {
                    id: true,
                    fullName: true,
                    role: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    res.json(posts)
})

router.post('/', requireAuth, async (req, res) => {
    const { title, content } = req.body

    if (!content) {
        return res.status(400).json({ message: 'content is required' })
    }

    const post = await prisma.post.create({
        data: {
            title: title || content.slice(0, 60),
            content,
            authorId: req.user.id,
        },
    })

    await prisma.auditLog.create({
        data: {
            action: `Added Post`,
            entity: 'Post',
            entityId: post.id,
            userId: req.user.id
        }
    })

    res.status(201).json(post)
})

router.get('/pending', requireAuth, requireRole('leader', 'admin'), async (_, res) => {
    const posts = await prisma.post.findMany({
        where: { status: 'pending' },
        include: {
            author: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    res.json(posts)
})

router.patch('/:id/status', requireAuth, requireRole('leader', 'admin'), async (req, res) => {
    const { status } = req.body

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' })
    }

    const post = await prisma.post.update({
        where: { id: Number(req.params.id) },
        data: { status },
    })

    await prisma.auditLog.create({
        data: {
            action: `Updated Post Status to ${status}`,
            entity: 'Post',
            entityId: post.id,
            userId: req.user.id
        }
    })

    res.json(post)
})

router.delete('/:id', requireAuth, async (req, res) => {
    const post = await prisma.post.findUnique({
        where: { id: Number(req.params.id) },
    })

    if (!post) {
        return res.status(404).json({ message: 'Post not found' })
    }

    const isOwner = post.authorId === req.user.id
    const isAdmin = ['leader', 'admin', 'superadmin'].includes(req.user.role)

    if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Forbidden' })
    }

    await prisma.post.delete({
        where: { id: post.id },
    })

    await prisma.auditLog.create({
        data: {
            action: `Deleted Post`,
            entity: 'Post',
            entityId: post.id,
            userId: req.user.id
        }
    })

    res.json({ message: 'Post deleted' })
})

module.exports = router