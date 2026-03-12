import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            status: 'PENDING',
        },
        select: {
            email: true,
            otp: true,
            otpExpiresAt: true,
        },
        orderBy: {
            updatedAt: 'desc'
        },
        take: 5
    });

    console.log("--- RECENT PENDING USERS AND OTPS ---");
    if (users.length === 0) {
        console.log("No pending users found. Did you submit the signup form?");
    }

    users.forEach(u => {
        const expired = u.otpExpiresAt && new Date() > u.otpExpiresAt ? '(EXPIRED)' : '';
        console.log(`Email: ${u.email} | OTP: ${u.otp} ${expired}`);
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
