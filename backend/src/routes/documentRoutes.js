const express = require('express')
const path = require('path')
const prisma = require('../lib/prisma')
const { requireAuth, requireRole } = require('../middleware/authMiddleware')
const { uploadDocument } = require('../middleware/documentUpload')

const router = express.Router()

// Get documents by category
router.get('/:category', async (req, res) => {
    const { category } = req.params
    const docs = await prisma.document.findMany({
        where: { category, isPublic: true },
        include: {
            uploader: {
                select: { id: true, fullName: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    const baseUrl = `${req.protocol}://${req.get('host')}`
    res.json(docs.map(doc => ({
        ...doc,
        url: `${baseUrl}/uploads/documents/${doc.filename}`,
        downloadUrl: `${baseUrl}/api/documents/download/${doc.id}`
    })))
})

// Admin: Get all documents (including private)
router.get('/admin/all', requireAuth, requireRole('admin', 'leader'), async (req, res) => {
    const docs = await prisma.document.findMany({
        include: {
            uploader: {
                select: { id: true, fullName: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
    const baseUrl = `${req.protocol}://${req.get('host')}`
    res.json(docs.map(doc => ({
        ...doc,
        url: `${baseUrl}/uploads/documents/${doc.filename}`,
        downloadUrl: `${baseUrl}/api/documents/download/${doc.id}`
    })))
})

// Upload document
router.post('/upload', requireAuth, requireRole('admin', 'leader'), uploadDocument.array('documents', 10), async (req, res) => {
    const files = req.files
    if (!files || files.length === 0) return res.status(400).json({ message: 'No files uploaded' })

    const { category, isPublic } = req.body
    
    // Instead of using the single 'title' field which won't map well to multiple files,
    // we just use the original filename without extension for bulk uploads.
    
    const docs = []
    for (const file of files) {
        const doc = await prisma.document.create({
            data: {
                title: path.parse(file.originalname).name,
                filename: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                category: category || 'downloads',
                isPublic: isPublic === 'false' ? false : true,
                uploaderId: req.user.id
            }
        })
        docs.push(doc)
    }

    res.status(201).json({ message: `Successfully uploaded ${docs.length} files.`, docs })
})

// Download document
router.get('/download/:id', async (req, res) => {
    const doc = await prisma.document.findUnique({
        where: { id: Number(req.params.id) }
    })

    if (!doc) return res.status(404).json({ message: 'Document not found' })

    // Log download (optional, similar to photo download)
    await prisma.downloadLog.create({
        data: {
            kind: 'document',
            targetId: doc.id
        }
    })

    const filePath = path.join(process.cwd(), 'uploads/documents', doc.filename)
    res.download(filePath, doc.originalName)
})

// Delete document
router.delete('/:id', requireAuth, requireRole('admin', 'leader'), async (req, res) => {
    const id = Number(req.params.id)
    const doc = await prisma.document.findUnique({ where: { id } })
    if (!doc) return res.status(404).json({ message: 'Document not found' })

    const filePath = path.join(process.cwd(), 'uploads/documents', doc.filename)
    const fs = require('fs')
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    await prisma.document.delete({ where: { id } })
    res.json({ message: 'Document deleted' })
})

module.exports = router
