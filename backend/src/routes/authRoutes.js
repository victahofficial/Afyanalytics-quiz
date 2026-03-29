const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'fullName, email, and password are required' })
        }

        const existingEmail = await prisma.user.findUnique({ where: { email } })
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        if (phone) {
            const existingPhone = await prisma.user.findUnique({ where: { phone } })
            if (existingPhone) {
                return res.status(400).json({ message: 'Phone already exists' })
            }
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                phone: phone || null,
                passwordHash,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                role: true,
                status: true,
            },
        })

        return res.status(201).json(user)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Register failed' })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        if (user.status !== 'approved') {
            return res.status(403).json({ message: 'Your account is pending approval by an admin.' })
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        return res.json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
            },
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Login failed' })
    }
})

router.post('/bootstrap-admin', async (req, res) => {
    try {
        const { email, setupKey } = req.body

        if (setupKey !== process.env.ADMIN_SETUP_KEY) {
            return res.status(403).json({ message: 'Invalid setup key' })
        }

        const adminCount = await prisma.user.count({
            where: { role: 'admin' },
        })

        if (adminCount > 0) {
            return res.status(403).json({ message: 'Admin already exists' })
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { role: 'admin' },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
            },
        })

        return res.json(updated)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Bootstrap admin failed' })
    }
})

router.get('/me', requireAuth, async (req, res) => {
    return res.json({
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        status: req.user.status,
    })
})

module.exports = router