const express = require('express')
const path = require('path')
const fs = require('fs')
const prisma = require('../lib/prisma')
const { requireAuth, requireRole } = require('../middleware/authMiddleware')
const { uploadHomepageImage } = require('../middleware/homepageUpload')
let sharp
try { sharp = require('sharp') } catch { sharp = null }

const router = express.Router()

// Default homepage content
const DEFAULTS = {
    heroEyebrow: 'Flamingo Rover Scouts',
    heroTitle: 'Scouting services simplified',
    heroSubtitle: 'Educating young people to play a constructive role in society',
    heroImage: '/images/hero.jpg',
    heroSlides: JSON.stringify([]),
    siteLogo: '',
    shopSectionEyebrow: 'Shop Preview',
    shopSectionTitle: 'Scarfs, woggles, shirts, and badges',
    newsSectionEyebrow: 'Latest News',
    newsSectionTitle: 'What is happening in Flamingo right now',
    gallerySectionEyebrow: 'Gallery',
    gallerySectionTitle: 'Photos where they should actually be',
    ctaEyebrow: 'Admin Control',
    ctaTitle: 'Separate admin side for managing the full website',
    ctaText: 'Admins and leaders will use a separate dashboard for shop products, images, prices, letters, news, gallery uploads, and meeting notices.',
    footerTitle: 'Scouting for Life',
    footerText: 'Public website for scouting stories, photos, shop items, letters, and community updates.',
    newsImage1: '/images/photo2.jpg',
    newsImage2: '/images/photo1.jpg',
    newsImage3: '/images/photo3.jpg',
    letterImage1: '/images/photo1.jpg',
    letterImage2: '/images/photo4.jpg',
    letterImage3: '/images/photo3.jpg',
    galleryImage1: '/images/photo1.jpg',
    galleryImage2: '/images/photo2.jpg',
    galleryImage3: '/images/photo3.jpg',
    galleryImage4: '/images/photo4.jpg',
    newsItems: JSON.stringify([
        { id: 1, title: 'Community Cleanup Drive', category: 'Service', text: 'Members are invited for the monthly cleanup and awareness activity around campus and nearby neighbourhoods.' },
        { id: 2, title: 'Band Practice Schedule Updated', category: 'Training', text: 'Weekday practice remains active with a refreshed timetable for new and returning members.' },
        { id: 3, title: 'Peace Campaign Feature Story', category: 'News', text: 'A new feature story celebrates the impact of youth-led advocacy and service in the local community.' },
    ]),
    letterItems: JSON.stringify([
        { id: 1, title: 'Chairperson Letter', date: 'March 2026', text: 'A short message on growth, service, discipline, and what the next season looks like for Scouting for Life.' },
        { id: 2, title: 'Monthly Newsletter', date: 'February 2026', text: 'Highlights from field activities, leadership updates, upcoming events, and member spotlights.' },
        { id: 3, title: 'Projects Brief', date: 'January 2026', text: 'A quick round-up of active projects, volunteer opportunities, and outreach work.' },
    ]),
    galleryItems: JSON.stringify([
        { id: 1, title: 'Camp Activity', image: '/images/photo1.jpg' },
        { id: 2, title: 'Parade Day', image: '/images/photo2.jpg' },
        { id: 3, title: 'Tree Planting', image: '/images/photo3.jpg' },
        { id: 4, title: 'Scout Gathering', image: '/images/photo4.jpg' },
    ]),
}

function buildSettings(dbSettings) {
    const result = { ...DEFAULTS }
    for (const s of dbSettings) {
        result[s.key] = s.value
    }
    return result
}

// PUBLIC: Get all site settings
router.get('/public', async (req, res) => {
    try {
        const settings = await prisma.siteSetting.findMany()
        const result = buildSettings(settings)
        // Prefix image paths with base URL for frontend
        const baseUrl = `${req.protocol}://${req.get('host')}`
        for (const key of Object.keys(result)) {
            if (key.toLowerCase().includes('image') && result[key] && result[key].startsWith('/uploads/')) {
                result[key] = `${baseUrl}${result[key]}`
            }
        }
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to load site settings' })
    }
})

// ADMIN: Get all settings for editing
router.get('/', requireAuth, requireRole('admin', 'leader'), async (req, res) => {
    try {
        const settings = await prisma.siteSetting.findMany()
        const result = buildSettings(settings)
        const baseUrl = `${req.protocol}://${req.get('host')}`
        for (const key of Object.keys(result)) {
            if (key.toLowerCase().includes('image') && result[key] && result[key].startsWith('/uploads/')) {
                result[key] = `${baseUrl}${result[key]}`
            }
        }
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to load site settings' })
    }
})

// ADMIN: Update text settings
router.put('/', requireAuth, requireRole('admin', 'leader'), async (req, res) => {
    try {
        const updates = req.body
        const keys = Object.keys(updates)

        for (const key of keys) {
            await prisma.siteSetting.upsert({
                where: { key },
                update: { value: String(updates[key]) },
                create: { key, value: String(updates[key]) },
            })
        }

        await prisma.auditLog.create({
            data: {
                action: `Updated Homepage Settings (${keys.join(', ')})`,
                entity: 'SiteSetting',
                userId: req.user.id,
            },
        })

        res.json({ message: 'Settings updated successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to update settings' })
    }
})

// ADMIN: Upload an image for a specific setting key
router.post(
    '/upload-image',
    requireAuth,
    requireRole('admin', 'leader'),
    uploadHomepageImage.single('image'),
    async (req, res) => {
        try {
            const { key } = req.body
            if (!key || !req.file) {
                return res.status(400).json({ message: 'key and image file are required' })
            }

            let imagePath = `/uploads/homepage/${req.file.filename}`

            // Auto-process logo images with sharp
            if (key === 'siteLogo' && sharp) {
                const inputPath = path.join(process.cwd(), 'uploads', 'homepage', req.file.filename)
                const ext = path.extname(req.file.filename)
                const outputName = req.file.filename.replace(ext, '_logo.png')
                const outputPath = path.join(process.cwd(), 'uploads', 'homepage', outputName)

                await sharp(inputPath)
                    .resize(80, 80, { fit: 'cover', position: 'center' })
                    .png()
                    .toFile(outputPath)

                // Remove original, use processed version
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
                imagePath = `/uploads/homepage/${outputName}`
            }

            await prisma.siteSetting.upsert({
                where: { key },
                update: { value: imagePath },
                create: { key, value: imagePath },
            })

            await prisma.auditLog.create({
                data: {
                    action: `Uploaded Homepage Image (${key})`,
                    entity: 'SiteSetting',
                    userId: req.user.id,
                },
            })

            const baseUrl = `${req.protocol}://${req.get('host')}`
            res.json({ message: 'Image uploaded', url: `${baseUrl}${imagePath}` })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Failed to upload image' })
        }
    }
)

module.exports = router
