const fs = require('fs')
const path = require('path')
const multer = require('multer')

const uploadDir = path.join(process.cwd(), 'uploads', 'homepage')
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, uploadDir)
    },
    filename: (_, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, `${unique}${path.extname(file.originalname)}`)
    },
})

const fileFilter = (_, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.mimetype)) {
        return cb(new Error('Only JPG, PNG, and WEBP files are allowed'))
    }
    cb(null, true)
}

const uploadHomepageImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
})

module.exports = { uploadHomepageImage }
