const express = require('express')
const prisma = require('../lib/prisma')
const { requireAuth, requireRole } = require('../middleware/authMiddleware')

const router = express.Router()

// Get all pages (or a single page by query)
router.get('/', async (req, res) => {
    try {
        const pages = await prisma.pageContent.findMany()
        res.json(pages)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to fetch pages' })
    }
})

// Get single page by slug
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params
        const page = await prisma.pageContent.findUnique({
            where: { slug }
        })
        if (!page) {
            return res.status(404).json({ message: 'Page not found' })
        }
        res.json(page)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to fetch page' })
    }
})

// Update or create a page
router.put('/:slug', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
        const { slug } = req.params
        const { title, eyebrow, body } = req.body

        if (!title || !body) {
            return res.status(400).json({ message: 'Title and body are required' })
        }

        const updatedPage = await prisma.pageContent.upsert({
            where: { slug },
            update: { title, eyebrow: eyebrow || '', body },
            create: { slug, title, eyebrow: eyebrow || '', body }
        })

        res.json(updatedPage)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to update page' })
    }
})

module.exports = router
