const express = require('express')
const prisma = require('../lib/prisma')
const { requireAuth, requireRole } = require('../middleware/authMiddleware')
const { syncSocialFeeds } = require('../lib/metaSync')

const router = express.Router()

// PUBLIC: Get social feeds (last posts and accounts)
router.get('/feed', async (req, res) => {
    try {
        // Trigger background sync (non-blocking)
        syncSocialFeeds().catch(err => console.error('Background sync failed:', err))

        const [accounts, posts] = await Promise.all([
            prisma.socialAccount.findMany({ where: { isActive: true } }),
            prisma.socialPost.findMany({ take: 6, orderBy: { postedAt: 'desc' } })
        ])
        res.json({ accounts, posts })
    } catch (error) {
        res.status(500).json({ message: 'Failed to load social feed' })
    }
})

// ADMIN: Trigger manual sync
router.post('/sync', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
        const result = await syncSocialFeeds()
        res.json({ success: true, message: result ? 'Sync triggered' : 'Recently synced, skipping' })
    } catch (error) {
        res.status(500).json({ message: 'Sync failed' })
    }
})

// ADMIN: Manage Social Accounts
router.get('/accounts', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
        const accounts = await prisma.socialAccount.findMany()
        res.json(accounts)
    } catch (error) {
        res.status(500).json({ message: 'Failed to load social accounts' })
    }
})

router.post('/accounts', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
        const { platform, url, icon, isActive } = req.body
        const account = await prisma.socialAccount.create({
            data: { platform, url, icon, isActive }
        })
        res.json(account)
    } catch (error) {
        res.status(500).json({ message: 'Failed to create social account' })
    }
})

router.put('/accounts/:id', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
        const { platform, url, icon, isActive } = req.body
        const account = await prisma.socialAccount.update({
            where: { id: parseInt(req.params.id) },
            data: { platform, url, icon, isActive }
        })
        res.json(account)
    } catch (error) {
        res.status(500).json({ message: 'Failed to update social account' })
    }
})

// ADMIN: Manage Social Posts (Manual feeding for the widget)
router.get('/posts', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
        const posts = await prisma.socialPost.findMany({ orderBy: { postedAt: 'desc' } })
        res.json(posts)
    } catch (error) {
        res.status(500).json({ message: 'Failed to load social posts' })
    }
})

router.post('/posts', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
        const { platform, content, postUrl, imageUrl, postedAt } = req.body
        const post = await prisma.socialPost.create({
            data: { platform, content, postUrl, imageUrl, postedAt: postedAt ? new Date(postedAt) : undefined }
        })
        res.json(post)
    } catch (error) {
        res.status(500).json({ message: 'Failed to create social post' })
    }
})

router.delete('/posts/:id', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
        await prisma.socialPost.delete({
            where: { id: parseInt(req.params.id) }
        })
        res.json({ message: 'Post removed' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove social post' })
    }
})

module.exports = router
