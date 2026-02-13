import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedProperty(data: any) {
    const existing = await prisma.property.findFirst({
        where: { title: data.title }
    });
    if (existing) {
        console.log(`- Property already exists: ${data.title}`);
        return existing;
    }
    const property = await prisma.property.create({ data });
    console.log(`✅ Created: ${data.title}`);
    return property;
}

async function main() {
    // Property 1 (Residential)
    await seedProperty({
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
    });

    // Property 2 (Commercial)
    await seedProperty({
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
    });

    // Property 3 (Industrial Shed)
    await seedProperty({
        title: 'Prime Prefabricated Steel Shed for Rent I-9 Markaz, Islamabad',
        description: 'Prime Prefabricated Steel Shed for Rent in I-9 Markaz Industrial Area. This spacious and well-ventilated structure features a total covered area of 22,000 sq. ft. with a height of 35 ft. Includes a separate office area for admin or sales operations, ample inside and outside parking, a 200 KVA dedicated transformer, and water boring. Ideally suited for car showrooms, brand outlets, display centers, warehousing, or corporate setups.',
        type: 'INDUSTRIAL',
        purpose: 'RENT',
        status: 'AVAILABLE',
        price: 5000000,
        priceUnit: 'PKR',
        priceType: 'monthly',
        area: 22000,
        areaUnit: 'sqft',
        location: 'I-9 | Islamabad | Main Sohni Road, I-9 Markaz Industrial Area',
        features: [
            'Separate Office Area',
            '35 ft Height',
            'Ample Parking',
            '200 KVA Transformer',
            'Water Boring',
            'Well-ventilated',
            'Steel Shed Structure'
        ],
        images: [],
        videos: ['/videos/property3.mp4'],
        isFeatured: true,
    });
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
