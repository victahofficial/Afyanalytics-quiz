const express = require('express')
const path = require('path')
const prisma = require('../lib/prisma')
const { requireAuth } = require('../middleware/authMiddleware')
const { uploadPhoto } = require('../middleware/uploadMiddleware')

const router = express.Router()

router.get('/', async (req, res) => {
    const photos = await prisma.photo.findMany({
        include: {
            uploader: {
                select: {
                    id: true,
                    fullName: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    const baseUrl = `${req.protocol}://${req.get('host')}`

    res.json(
        photos.map((photo) => ({
            ...photo,
            url: photo.externalUrl || `${baseUrl}/uploads/photos/${photo.filename}`,
            downloadUrl: photo.filename ? `${baseUrl}/api/photos/${photo.id}/download` : null,
        }))
    )
})

router.post('/upload', requireAuth, uploadPhoto.single('photo'), async (req, res) => {
    const file = req.file

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }

    const photo = await prisma.photo.create({
        data: {
            title: req.body.title || path.parse(file.originalname).name,
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            uploaderId: req.user.id,
        },
    })

    res.status(201).json(photo)
})

router.get('/:id/download', async (req, res) => {
    const photo = await prisma.photo.findUnique({
        where: { id: Number(req.params.id) },
    })

    if (!photo) {
        return res.status(404).json({ message: 'Photo not found' })
    }

    await prisma.downloadLog.create({
        data: {
            kind: 'photo',
            targetId: photo.id,
        },
    })

    return res.download(
        path.join(process.cwd(), 'uploads/photos', photo.filename),
        photo.originalName
    )
})

// Upload by link (external URL)
router.post('/upload-link', requireAuth, async (req, res) => {
    const { url, title } = req.body
    if (!url) return res.status(400).json({ message: 'URL is required' })

    const photo = await prisma.photo.create({
        data: {
            title: title || 'Linked Photo',
            filename: '',
            originalName: url,
            mimeType: 'link',
            size: 0,
            uploaderId: req.user.id,
            externalUrl: url,
        },
    })

    res.status(201).json(photo)
})

// Delete a photo
router.delete('/:id', requireAuth, async (req, res) => {
    const id = Number(req.params.id)
    const photo = await prisma.photo.findUnique({ where: { id } })
    if (!photo) return res.status(404).json({ message: 'Photo not found' })

    const isOwner = photo.uploaderId === req.user.id
    const isAdmin = ['leader', 'admin', 'superadmin'].includes(req.user.role)

    if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Forbidden' })
    }

    // Delete file from disk if it's a local file
    if (photo.filename) {
        const filePath = path.join(process.cwd(), 'uploads/photos', photo.filename)
        const fs = require('fs')
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    await prisma.photo.delete({ where: { id } })
    res.json({ message: 'Photo deleted' })
})

module.exports = router