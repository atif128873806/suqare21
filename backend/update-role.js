const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const user = await prisma.user.update({
    where: { email: 'admin@square21.pk' },
    data: { role: 'ADMIN' },
  });
  console.log('User Role Updated:', user.role);
}
run().finally(() => prisma.$disconnect());
