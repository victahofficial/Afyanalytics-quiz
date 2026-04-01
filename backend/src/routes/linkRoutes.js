const express = require('express')
const prisma = require('../lib/prisma')
const { requireAuth, requireRole } = require('../middleware/authMiddleware')

const router = express.Router()

// PUBLIC: Get all footer links
router.get('/', async (req, res) => {
    try {
        const links = await prisma.footerLink.findMany({
            orderBy: [{ column: 'asc' }, { order: 'asc' }]
        })
        res.json(links)
    } catch (error) {
        res.status(500).json({ message: 'Failed to load footer links' })
    }
})

// ADMIN: Get all links for management
router.get('/admin', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
        const links = await prisma.footerLink.findMany({
            orderBy: [{ column: 'asc' }, { order: 'asc' }]
        })
        res.json(links)
    } catch (error) {
        res.status(500).json({ message: 'Failed to load footer links' })
    }
})

// ADMIN: Create link
router.post('/', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
        const { title, url, column, order } = req.body
        const link = await prisma.footerLink.create({
            data: { title, url, column: parseInt(column), order: parseInt(order) || 0 }
        })
        res.json(link)
    } catch (error) {
        res.status(500).json({ message: 'Failed to create link' })
    }
})

// ADMIN: Update link
router.put('/:id', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
        const { title, url, column, order } = req.body
        const link = await prisma.footerLink.update({
            where: { id: parseInt(req.params.id) },
            data: { title, url, column: parseInt(column), order: parseInt(order) || 0 }
        })
        res.json(link)
    } catch (error) {
        res.status(500).json({ message: 'Failed to update link' })
    }
})

// ADMIN: Delete link
router.delete('/:id', requireAuth, requireRole('admin', 'superadmin'), async (req, res) => {
    try {
        await prisma.footerLink.delete({
            where: { id: parseInt(req.params.id) }
        })
        res.json({ message: 'Link deleted' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete link' })
    }
})

module.exports = router
