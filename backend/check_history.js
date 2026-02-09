const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const visitorId = process.argv[2] || 'test_fixed_v2';

    if (visitorId === 'recent') {
        const convo = await prisma.chatConversation.findFirst({
            orderBy: { updatedAt: 'desc' }
        });
        if (!convo) console.log('No recent conversation found');
        else {
            console.log('Recent Conversation (', convo.visitorId, '):');
            console.log(JSON.stringify(convo.history, null, 2));
        }
    } else {
        const convo = await prisma.chatConversation.findUnique({
            where: { visitorId }
        });
        if (!convo) console.log('No conversation found for', visitorId);
        else {
            console.log('Conversation History for', visitorId, ':');
            console.log(JSON.stringify(convo.history, null, 2));
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
