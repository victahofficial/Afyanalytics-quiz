const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(process.cwd(), 'uploads/documents')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/documents')
    },
    filename: (_, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, `${unique}${path.extname(file.originalname)}`)
    },
})

const fileFilter = (_, file, cb) => {
    const allowed = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'image/jpeg',
        'image/png'
    ]
    if (!allowed.includes(file.mimetype)) {
        return cb(new Error('File type not allowed. Please upload PDF, Word, Excel, Text or Images.'))
    }
    cb(null, true)
}

const uploadDocument = multer({
    storage,
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
})

module.exports = { uploadDocument }
