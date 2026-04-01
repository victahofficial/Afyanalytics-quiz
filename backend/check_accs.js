const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
    const accs = await prisma.socialAccount.findMany()
    console.log(JSON.stringify(accs, null, 2))
}
main()
