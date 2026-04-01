const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const prisma = require('./lib/prisma')
const { requireAuth, requireRole } = require('./middleware/authMiddleware')

const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const photoRoutes = require('./routes/photoRoutes')
const productRoutes = require('./routes/productRoutes')
const noticeRoutes = require('./routes/noticeRoutes')
const userRoutes = require('./routes/userRoutes')
const settingsRoutes = require('./routes/settingsRoutes')
const documentRoutes = require('./routes/documentRoutes')
const pageRoutes = require('./routes/pageRoutes')
const linkRoutes = require('./routes/linkRoutes')
const socialRoutes = require('./routes/socialRoutes')

const app = express()

// Performance: gzip compression
app.use(compression())
app.use(cors())
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))
app.use(express.json())

// Static assets with cache headers for performance
app.use('/uploads', express.static('uploads', {
    maxAge: '1h',
    etag: true,
}))

// Rate limiting — generous for high traffic
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/photos', photoRoutes)
app.use('/api/notices', noticeRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/pages', pageRoutes)
app.use('/api/links', linkRoutes)
app.use('/api/social', socialRoutes)

app.get('/api/health', (_, res) => {
    res.json({ ok: true, message: 'Backend is running' })
})

// Admin stats endpoint — user counts and recent activity
app.get('/api/stats', requireAuth, requireRole('admin', 'leader'), async (req, res) => {
    try {
        const [totalUsers, admins, members, approved, pending, recentLogs] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: { in: ['admin', 'superadmin', 'leader'] } } }),
            prisma.user.count({ where: { role: 'member' } }),
            prisma.user.count({ where: { status: 'approved' } }),
            prisma.user.count({ where: { status: 'pending' } }),
            prisma.auditLog.findMany({
                take: 20,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { fullName: true, email: true } } },
            }),
        ])

        res.json({ totalUsers, admins, members, approved, pending, recentLogs })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to load stats' })
    }
})

module.exports = app