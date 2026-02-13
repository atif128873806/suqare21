import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const property = await prisma.property.create({
        data: {
            title: 'Brand New 4 Marla House for Sale in I-10/1 Islamabad | CDA Transfer',
            description: 'A beautiful and solidly built brand new house is available for sale in the prime location of I-10/1, Islamabad. This house is ideal for families looking for comfort, quality, and a secure investment. Features 5 spacious bedrooms, 5 modern bathrooms, TV lounge, drawing/dining area, stylish open kitchen, servant space, and car parking. Solid construction with premium finishing. CDA transfer available. Gas, water & electricity installed with proper sewerage system. Located near main road, market & mosque with easy access to Kashmir Highway & Metro Station.',
            type: 'RESIDENTIAL',
            purpose: 'SALE',
            status: 'AVAILABLE',
            price: 27500000,
            priceUnit: 'PKR',
            priceType: 'total',
            area: 4,
            areaUnit: 'marla',
            location: 'I-10/1 | Islamabad | I-10/1, Near Main Road, Market & Mosque',
            features: [
                '5 Bedrooms',
                '5 Bathrooms',
                'TV Lounge',
                'Drawing/Dining Area',
                'Open Kitchen',
                'Servant Space',
                'Car Parking',
                'Premium Finishing',
                'Brand New',
                'CDA Transfer',
                'Gas, Water & Electricity',
                'Sewerage System',
                'Near Kashmir Highway',
                'Near Metro Station',
            ],
            images: [],
            videos: ['/videos/property1.mp4'],
            isFeatured: true,
        },
    });
    console.log('✅ Property created successfully!');
    console.log('ID:', property.id);
    console.log('Title:', property.title);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
