const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/photos')
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

const uploadPhoto = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
})

module.exports = { uploadPhoto }