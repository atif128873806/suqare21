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

    // Property 4 (The Cluster)
    await seedProperty({
        title: 'The CLUSTER - State-of-the-Art Commercial Building I-10/3, Islamabad',
        description: 'The CLUSTER is a state-of-the-art commercial building located in the prime sector of I-10/3, offering a perfect space for corporate offices, IT companies, call centers, or other professional setups. Total Covered Area: 6,000 Sqft, with 2,000 Sqft currently available. The property enjoys an ideal location with easy access to the main road and all major commercial hubs. Features include backup power, valet parking, in-house cafeteria, and 24/7 security. The space is semi-furnished with networking cables installed, an elegant reception, and spacious meeting rooms. Rental spaces available in Cluster.',
        type: 'COMMERCIAL',
        purpose: 'RENT',
        status: 'AVAILABLE',
        price: 0,
        priceUnit: 'PKR',
        priceType: 'monthly',
        area: 2000,
        areaUnit: 'sqft',
        location: 'I-10/3 | Islamabad | I-10/3, Islamabad',
        features: [
            'Backup Power (Generators)',
            'Valet Car Parking',
            'In-house Cafeteria',
            '24/7 Security & CCTV',
            'Semi-furnished',
            'Networking Cables Installed',
            'Elegant Reception',
            'Conference Rooms',
            'Separate Washrooms',
            'Ventilated Rooms'
        ],
        images: [],
        videos: ['/videos/property4.mp4'],
        isFeatured: true,
    });

    // Property 5 (8000 SQFT Commercial)
    await seedProperty({
        title: 'State-of-the-Art Commercial Building – 8,000 SQFT',
        description: 'Experience a premium commercial space designed to meet the demands of modern businesses. This well-planned and spacious facility offers a professional environment with all essential amenities under one roof. Designed to provide efficiency, comfort, and a high-end corporate image, this property is perfectly suited for growing and established businesses alike.',
        type: 'COMMERCIAL',
        purpose: 'RENT',
        status: 'AVAILABLE',
        price: 0,
        priceUnit: 'PKR',
        priceType: 'monthly',
        area: 8000,
        areaUnit: 'sqft',
        location: 'Islamabad | Islamabad | Prime Location',
        features: [
            '8,000 SQFT Covered Area',
            'Contemporary Infrastructure',
            'Essential Facilities',
            'Ample Space',
            'Functional Layout',
            'Corporate Offices',
            'IT Firms',
            'Commercial Use'
        ],
        images: [],
        videos: ['/videos/property5.mp4'],
        isFeatured: true,
    });

    // Property 6 (House I-10/4)
    await seedProperty({
        title: 'Brand New Double-Story House for Sale in I-10/4, Islamabad',
        description: 'A beautifully constructed brand-new double-story house located in a prime area of I-10/4. Ideal for families or investors seeking strong rental returns. Features include 5 spacious bedrooms with attached bathrooms, 2 TV lounges, 2 drawing rooms, and 2 modern kitchens. All utilities (Water, Electricity, Gas) are available. Current Rental Income potential is approx. PKR 185,000 per month. A perfect opportunity for both end-users and investors looking for steady rental income in a well-developed CDA sector.',
        type: 'RESIDENTIAL',
        purpose: 'SALE',
        status: 'AVAILABLE',
        price: 52500000,
        priceUnit: 'PKR',
        priceType: 'total',
        area: 5,
        areaUnit: 'marla',
        location: 'I-10/4 | Islamabad | I-10/4, Islamabad',
        features: [
            '5 Bedrooms',
            '5 Bathrooms',
            '2 TV Lounges',
            '2 Drawing Rooms',
            '2 Modern Kitchens',
            'Brand New',
            'Gas, Water & Electricity',
            'Double Story',
            'Rental Income Potential'
        ],
        images: [],
        videos: ['/videos/property6.mp4'],
        isFeatured: true,
    });

    // Property 7 (The Arch G-11/3)
    await seedProperty({
        title: 'The Arch – G-11/3 | Ready for Rent',
        description: 'Discover a stylish and comfortable living space at The Arch, G-11/3, now available for immediate occupancy. Perfectly designed for modern family living with elegance and convenience. Features include 3 spacious bedrooms with attached bathrooms, a spacious TV lounge, and an elegant drawing room. Enjoy stunning terrace views and a beautiful balcony. Maintenance is included in the rent. Ready to Move In! Ideal for families seeking comfort, style, and a premium living experience in G-11/3, Islamabad.',
        type: 'RESIDENTIAL',
        purpose: 'RENT',
        status: 'AVAILABLE',
        price: 185000,
        priceUnit: 'PKR',
        priceType: 'monthly',
        area: 0,
        areaUnit: 'sqft',
        location: 'G-11/3 | Islamabad | The Arch, G-11/3, Islamabad',
        features: [
            '3 Bedrooms',
            '3 Attached Bathrooms',
            'Spacious TV Lounge',
            'Elegant Drawing Room',
            'Terrace Views',
            'Beautiful Balcony',
            'Maintenance Included',
            'Modern Family Living',
            'Ready to Move In'
        ],
        images: [],
        videos: ['/videos/property7.mp4'],
        isFeatured: true,
    });

    // Property 8 (Rent)
    await seedProperty({
        title: 'Commercial Building for Rent – I-10/1 Class III Markaz, Islamabad',
        description: 'An excellent opportunity to secure a well-located commercial building in the prime area of I-10/1 Class III Markaz, Islamabad. Ideal for corporate offices, software houses, clinics, educational institutes, and other commercial activities. Property Details: Total Covered Area: 2,602 Sqft. Structure: Ground + 1st + 2nd Floor. Front & Side Open – Excellent visibility and ventilation. 1 Washroom on Each Floor, 1 Kitchen Installed. Solid construction with practical layout.',
        type: 'COMMERCIAL',
        purpose: 'RENT',
        status: 'AVAILABLE',
        price: 420000,
        priceUnit: 'PKR',
        priceType: 'monthly',
        area: 2602,
        areaUnit: 'sqft',
        location: 'I-10/1 | Islamabad | I-10/1 Class III Markaz, Islamabad',
        features: [
            '2,602 Sqft Covered Area',
            'Ground + 2 Floors',
            'Front & Side Open',
            'Excellent Ventilation',
            '3 Washrooms (1 per floor)',
            'Kitchen Installed',
            'Corporate/Clinic/Institute Ideal'
        ],
        images: [],
        videos: ['/videos/property8.mp4'],
        isFeatured: true,
    });

    // Property 8 (Sale)
    await seedProperty({
        title: 'Commercial Building for Sale – I-10/1 Class III Markaz, Islamabad',
        description: 'A prime commercial opportunity available in I-10/1 Class III Markaz, Islamabad — ideal for investors and business owners looking for a high-potential property in a sought-after location. Property Details: Total Covered Area: 2,602 Sqft. Structure: Ground + 1st + 2nd Floor. 3-Side Corner Building. Front & Side Open – Maximum exposure & natural light. 1 Washroom on Each Floor, 1 Kitchen Installed. Legal Status: CDA Transfer Available.',
        type: 'COMMERCIAL',
        purpose: 'SALE',
        status: 'AVAILABLE',
        price: 87500000,
        priceUnit: 'PKR',
        priceType: 'total',
        area: 2602,
        areaUnit: 'sqft',
        location: 'I-10/1 | Islamabad | I-10/1 Class III Markaz, Islamabad',
        features: [
            '2,602 Sqft Covered Area',
            'Ground + 2 Floors',
            '3-Side Corner Building',
            'CDA Transfer Available',
            'High Rental Potential',
            'Front & Side Open',
            '3 Washrooms',
            'Kitchen Installed'
        ],
        images: [],
        videos: ['/videos/property8.mp4'],
        isFeatured: true,
    });

    // Property 9 (RCC Warehouse I-9)
    await seedProperty({
        title: 'Prime RCC Warehouse for Rent – I-9',
        description: 'Prime RCC Warehouse available for rent in I-9 Main, near Dry Port Road. Perfect for storage, distribution, production, and industrial operations. Features include an 11,000 sqft RCC Hall with 20+ ft height, easy access for heavy vehicles, separate office space (plus offices on the first floor), a 100 KVA dedicated transformer, and separate electricity connection. Includes a security guard cabin and common ablution area/washroom.',
        type: 'INDUSTRIAL',
        purpose: 'RENT',
        status: 'AVAILABLE',
        price: 150,
        priceUnit: 'PKR',
        priceType: 'per_sqft',
        area: 11000,
        areaUnit: 'sqft',
        location: 'I-9 | Islamabad | I-9/2, Near Dry Port Road',
        features: [
            '11,000 Sqft Covered Area',
            'RCC Hall Structure',
            '20+ ft Height',
            '100 KVA Transformer',
            'Heavy Vehicle Access',
            'Separate Electricity',
            'Office Space Included',
            'Guard Cabin'
        ],
        images: [],
        videos: ['/videos/property9.mp4'],
        isFeatured: true,
    });

    // Property 10 (Savoy Residence F-11)
    await seedProperty({
        title: 'Apartment for Rent – Savoy Residence, F-11 Markaz',
        description: 'A beautiful family apartment available for rent in Savoy Residence, located in the heart of F-11 Markaz. Prime location with a peaceful park-facing view. Features include 2 bedrooms with attached bathrooms, a spacious drawing and dining area, modern kitchen, and dedicated car parking. This is a secure and well-maintained building. **Strictly for Families Only** - An ideal option for those seeking comfort, security, and a premium lifestyle in one of Islamabad’s top sectors.',
        type: 'RESIDENTIAL',
        purpose: 'RENT',
        status: 'AVAILABLE',
        price: 150000,
        priceUnit: 'PKR',
        priceType: 'monthly',
        area: 0,
        areaUnit: 'sqft',
        location: 'F-11 Markaz | Islamabad | Savoy Residence, F-11 Markaz',
        features: [
            'Families Only',
            '2 Bedrooms',
            '2 Attached Bathrooms',
            'Park Facing',
            'Spacious Drawing & Dining',
            'Modern Kitchen',
            'Dedicated Parking',
            'Secure Building'
        ],
        images: [],
        videos: ['/videos/property10.mp4'],
        isFeatured: true,
    });

    // Property 11 (18 West Residencia F-11)
    await seedProperty({
        title: 'Fully Furnished Apartment for Rent – 18 West Residencia, F-11/1',
        description: 'Experience premium living in one of the most sought-after residential buildings of F-11/1. Located in the prestigious 18 West Residencia, a pure residential building where most apartments are fully furnished. This 5th-floor apartment features 2 bedrooms, a spacious TV lounge, modern kitchen, and stylish bathrooms. Ideally suited for families and executives looking for a premium furnished living experience in a prime Islamabad location.',
        type: 'RESIDENTIAL',
        purpose: 'RENT',
        status: 'AVAILABLE',
        price: 250000,
        priceUnit: 'PKR',
        priceType: 'monthly',
        area: 0,
        areaUnit: 'sqft',
        location: 'F-11/1 | Islamabad | 18 West Residencia, F-11/1',
        features: [
            'Fully Furnished',
            '5th Floor',
            '2 Bedrooms',
            'Spacious TV Lounge',
            'Modern Kitchen',
            'Stylish Bathrooms',
            'Dedicated Parking',
            'Secure Building',
            'Premium Lifestyle'
        ],
        images: [],
        videos: ['/videos/property11.mp4'],
        isFeatured: true,
    });

    // Property 12 (Corner House I-10/4)
    await seedProperty({
        title: 'Brand New Corner House for Sale – I-10/4, Islamabad',
        description: 'An excellent investment opportunity in one of the best locations of I-10/4. Ideally located near Markaz, this brand-new corner house offers strong rental returns and long-term value. Features include solid construction, modern layout, and a prime 2-side corner location. This property offers high investment potential with an estimated rental income of PKR 200,000 per month. Legal Status: CDA Transfer Available.',
        type: 'RESIDENTIAL',
        purpose: 'SALE',
        status: 'AVAILABLE',
        price: 70000000,
        priceUnit: 'PKR',
        priceType: 'total',
        area: 6,
        areaUnit: 'marla',
        location: 'I-10/4 | Islamabad | I-10/4, Near Markaz',
        features: [
            '6 Marla',
            '2-Side Corner',
            'Brand New',
            'Near Markaz',
            'Solid Construction',
            'High Rental Income',
            'CDA Transfer Available',
            'Investment Opportunity'
        ],
        images: [],
        videos: ['/videos/property12.mp4'],
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
