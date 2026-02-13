import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // const property = await prisma.property.create({
    //     data: {
    //         title: 'Brand New 4 Marla House for Sale in I-10/1 Islamabad | CDA Transfer',
    //         description: 'A beautiful and solidly built brand new house is available for sale in the prime location of I-10/1, Islamabad. This house is ideal for families looking for comfort, quality, and a secure investment. Features 5 spacious bedrooms, 5 modern bathrooms, TV lounge, drawing/dining area, stylish open kitchen, servant space, and car parking. Solid construction with premium finishing. CDA transfer available. Gas, water & electricity installed with proper sewerage system. Located near main road, market & mosque with easy access to Kashmir Highway & Metro Station.',
    //         type: 'RESIDENTIAL',
    //         purpose: 'SALE',
    //         status: 'AVAILABLE',
    //         price: 27500000,
    //         priceUnit: 'PKR',
    //         priceType: 'total',
    //         area: 4,
    //         areaUnit: 'marla',
    //         location: 'I-10/1 | Islamabad | I-10/1, Near Main Road, Market & Mosque',
    //         features: [
    //             '5 Bedrooms',
    //             '5 Bathrooms',
    //             'TV Lounge',
    //             'Drawing/Dining Area',
    //             'Open Kitchen',
    //             'Servant Space',
    //             'Car Parking',
    //             'Premium Finishing',
    //             'Brand New',
    //             'CDA Transfer',
    //             'Gas, Water & Electricity',
    //             'Sewerage System',
    //             'Near Kashmir Highway',
    //             'Near Metro Station',
    //         ],
    //         images: [],
    //         videos: ['/videos/property1.mp4'],
    //         isFeatured: true,
    //     },
    // });
    // console.log('✅ Property 1 created successfully!');

    const property2 = await prisma.property.create({
        data: {
            title: 'Prime Commercial Space for Rent – F-8/3, Islamabad',
            description: 'A premium commercial property located in one of Islamabad’s most prestigious sectors. This spacious and well-maintained building is ideal for high-end multinational companies (MNCs), software houses, IT firms, and corporate offices. The layout offers large open working areas with dedicated facilities on each floor, ensuring comfort and functionality for professional teams. Serious corporate clients are welcome to schedule a viewing.',
            type: 'COMMERCIAL',
            purpose: 'RENT',
            status: 'AVAILABLE',
            price: 2000000,
            priceUnit: 'PKR',
            priceType: 'monthly',
            area: 5000,
            areaUnit: 'sqft',
            location: 'F-8/3 | Islamabad | F-8/3, Islamabad',
            features: [
                'Ground Floor + Lower Ground',
                '2 Washrooms on Each Floor',
                'Solar System Installed',
                'Prime Location',
                'Ideal for MNCs',
                'Ideal for IT Firms',
                'Open Layout'
            ],
            images: [],
            videos: ['/videos/property2.mp4'],
            isFeatured: true,
        },
    });
    console.log('✅ Property 2 created successfully!');
    console.log('ID:', property2.id);
    console.log('Title:', property2.title);
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
