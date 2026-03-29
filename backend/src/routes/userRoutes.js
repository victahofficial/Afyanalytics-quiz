const express = require('express')
const prisma = require('../lib/prisma')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

// Middleware to ensure superadmin
const requireSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Superadmin access required' })
    }
    next()
}

// Fetch all users
router.get('/', requireAuth, requireSuperAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        })
        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to fetch users' })
    }
})

// Update user role and status
router.patch('/:id/role', requireAuth, requireSuperAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const { role, status } = req.body

        if (parseInt(id) === req.user.id && role !== 'superadmin') {
            return res.status(400).json({ message: 'Cannot demote yourself directly' })
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { role, status }
        })

        await prisma.auditLog.create({
            data: {
                action: `Updated User Access (${user.email} -> ${role}, ${status})`,
                entity: 'User',
                entityId: user.id,
                userId: req.user.id
            }
        })

        res.json({ message: 'User updated successfully', user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to update user' })
    }
})

// Fetch audit logs
router.get('/audit-logs', requireAuth, async (req, res) => {
    try {
        if (req.user.role !== 'superadmin' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }

        const logs = await prisma.auditLog.findMany({
            include: {
                user: { select: { fullName: true, email: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 200
        })
        res.json(logs)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to fetch audit logs' })
    }
})

module.exports = router
