const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = 'victahoyaroh@gmail.com'
    const password = 'Vi182020'
    const passwordHash = await bcrypt.hash(password, 10)

    const superAdmin = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'superadmin',
            status: 'approved',
            passwordHash, // Reset password if they accidentally changed it previously
        },
        create: {
            fullName: 'Super Admin',
            email,
            passwordHash,
            role: 'superadmin',
            status: 'approved',
        },
    })
    console.log(`Upserted superadmin successfully: ${superAdmin.email}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
