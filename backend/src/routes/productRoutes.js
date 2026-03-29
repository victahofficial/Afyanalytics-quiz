const express = require('express')
const fs = require('fs')
const path = require('path')
const prisma = require('../lib/prisma')
const { requireAuth, requireRole } = require('../middleware/authMiddleware')
const { uploadProductImage } = require('../middleware/productUpload')

const router = express.Router()

function toInt(value, fallback = 0) {
    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : fallback
}

function toBool(value) {
    return value === true || value === 'true'
}

function serializeProduct(req, product) {
    const baseUrl = `${req.protocol}://${req.get('host')}`

    return {
        ...product,
        imageUrl: product.imagePath ? `${baseUrl}${product.imagePath}` : null,
    }
}

function deleteFileIfExists(relativePath) {
    if (!relativePath) return

    const fullPath = path.join(process.cwd(), relativePath.replace(/^\//, ''))
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
    }
}

router.get('/public', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        })

        res.json(products.map((product) => serializeProduct(req, product)))
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to load public products' })
    }
})

router.get('/admin', requireAuth, requireRole('admin', 'leader'), async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        })

        res.json(products.map((product) => serializeProduct(req, product)))
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to load admin products' })
    }
})

router.post(
    '/',
    requireAuth,
    requireRole('admin', 'leader'),
    uploadProductImage.single('image'),
    async (req, res) => {
        try {
            const { name, category, price, stock, description, isActive } = req.body

            if (!name || !category || !description) {
                return res.status(400).json({ message: 'name, category, and description are required' })
            }

            const product = await prisma.product.create({
                data: {
                    name,
                    category,
                    price: toInt(price),
                    stock: toInt(stock),
                    description,
                    isActive: toBool(isActive),
                    imagePath: req.file ? `/uploads/products/${req.file.filename}` : null,
                },
            })

            await prisma.auditLog.create({
                data: {
                    action: `Added Product`,
                    entity: 'Product',
                    entityId: product.id,
                    userId: req.user.id
                }
            })

            res.status(201).json(serializeProduct(req, product))
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Failed to create product' })
        }
    }
)

router.put(
    '/:id',
    requireAuth,
    requireRole('admin', 'leader'),
    uploadProductImage.single('image'),
    async (req, res) => {
        try {
            const id = Number(req.params.id)
            const existing = await prisma.product.findUnique({ where: { id } })

            if (!existing) {
                return res.status(404).json({ message: 'Product not found' })
            }

            let nextImagePath = existing.imagePath

            if (req.file) {
                deleteFileIfExists(existing.imagePath)
                nextImagePath = `/uploads/products/${req.file.filename}`
            }

            const product = await prisma.product.update({
                where: { id },
                data: {
                    name: req.body.name ?? existing.name,
                    category: req.body.category ?? existing.category,
                    price: req.body.price !== undefined ? toInt(req.body.price) : existing.price,
                    stock: req.body.stock !== undefined ? toInt(req.body.stock) : existing.stock,
                    description: req.body.description ?? existing.description,
                    isActive: req.body.isActive !== undefined ? toBool(req.body.isActive) : existing.isActive,
                    imagePath: nextImagePath,
                },
            })

            await prisma.auditLog.create({
                data: {
                    action: `Updated Product`,
                    entity: 'Product',
                    entityId: product.id,
                    userId: req.user.id
                }
            })

            res.json(serializeProduct(req, product))
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Failed to update product' })
        }
    }
)

router.delete('/:id', requireAuth, requireRole('admin', 'leader'), async (req, res) => {
    try {
        const id = Number(req.params.id)
        const existing = await prisma.product.findUnique({ where: { id } })

        if (!existing) {
            return res.status(404).json({ message: 'Product not found' })
        }

        deleteFileIfExists(existing.imagePath)

        await prisma.product.delete({ where: { id } })

        await prisma.auditLog.create({
            data: {
                action: `Deleted Product`,
                entity: 'Product',
                entityId: id,
                userId: req.user.id
            }
        })

        res.json({ message: 'Product deleted' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to delete product' })
    }
})

module.exports = router