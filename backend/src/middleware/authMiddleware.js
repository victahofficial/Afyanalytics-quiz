const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing token' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid user' })
    }

    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    // superadmin bypasses all role checks
    if (req.user.role === 'superadmin') {
      return next()
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}

module.exports = { requireAuth, requireRole }