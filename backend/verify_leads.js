
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkLeads() {
    try {
        const chatLeads = await prisma.chatLead.findMany({
            orderBy: { createdAt: 'desc' }
        });
        console.log('--- Chat Leads ---');
        console.log(JSON.stringify(chatLeads, null, 2));

        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        console.log('\n--- Unified Leads ---');
        console.log(JSON.stringify(leads, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkLeads();
