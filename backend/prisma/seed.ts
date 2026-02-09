import 'dotenv/config';
import { PrismaClient, PropertyType, PropertyPurpose, PropertyStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting database seeding...\n');

    // Create admin user
    const adminEmail = 'admin@square21.com';
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const existingUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingUser) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: 'Square21 Admin',
                role: 'ADMIN',
            },
        });
        console.log('✅ Admin user created: admin@square21.com / Admin@123');
    } else {
        console.log('ℹ️  Admin user already exists.');
    }

    // Create sample properties
    const propertyCount = await prisma.property.count();

    if (propertyCount === 0) {
        const properties = [
            {
                title: 'Premium Industrial Warehouse - I-9',
                description: 'Large industrial warehouse with modern facilities, ideal for manufacturing or logistics. Features loading docks, high ceilings, and 24/7 security.',
                type: PropertyType.INDUSTRIAL,
                purpose: PropertyPurpose.RENT,
                status: PropertyStatus.AVAILABLE,
                price: 850000,
                priceUnit: 'PKR',
                priceType: 'monthly',
                area: 15000,
                areaUnit: 'sqft',
                location: 'I-9 Industrial Area, Main Boulevard',
                images: ['/assets/property-industrial.jpg'],
                features: ['Loading Docks', '24/7 Security', 'High Ceilings', 'Power Backup', 'Parking'],
                isFeatured: true,
            },
            {
                title: 'Executive Office Space - F-8',
                description: 'Premium commercial office space in the heart of F-8. Modern architecture with panoramic views, perfect for corporate headquarters.',
                type: PropertyType.COMMERCIAL,
                purpose: PropertyPurpose.LEASE,
                status: PropertyStatus.AVAILABLE,
                price: 2500000,
                priceUnit: 'PKR',
                priceType: 'monthly',
                area: 8500,
                areaUnit: 'sqft',
                location: 'F-8 Markaz, Commercial Area',
                images: ['/assets/property-commercial.jpg'],
                features: ['Reception Area', 'Conference Rooms', 'Pantry', 'Parking', 'Elevator Access'],
                isFeatured: true,
            },
            {
                title: 'Luxury Penthouse - F-6',
                description: 'Stunning luxury penthouse with breathtaking city views. Features high-end finishes, private terrace, and smart home automation.',
                type: PropertyType.RESIDENTIAL,
                purpose: PropertyPurpose.RENT,
                status: PropertyStatus.AVAILABLE,
                price: 450000,
                priceUnit: 'PKR',
                priceType: 'monthly',
                area: 4200,
                areaUnit: 'sqft',
                location: 'F-6/3, Super Market Road',
                images: ['/assets/property-residential.jpg'],
                features: ['Private Terrace', 'Smart Home', 'Gym Access', 'Concierge', '2 Parking Spaces'],
                isFeatured: true,
            },
            {
                title: 'Industrial Unit - I-10',
                description: 'Modern industrial unit suitable for manufacturing or storage. Located in prime I-10 industrial zone with easy access to main highways.',
                type: PropertyType.INDUSTRIAL,
                purpose: PropertyPurpose.RENT,
                status: PropertyStatus.AVAILABLE,
                price: 650000,
                priceUnit: 'PKR',
                priceType: 'monthly',
                area: 12000,
                areaUnit: 'sqft',
                location: 'I-10/3 Industrial Area',
                images: ['/assets/property-industrial.jpg'],
                features: ['Heavy Power Supply', 'Wide Entrance', 'Office Space', 'Security'],
                isFeatured: false,
            },
            {
                title: 'Commercial Plaza - I-8',
                description: 'Prime commercial plaza for sale in I-8. Excellent investment opportunity with high rental yield potential.',
                type: PropertyType.COMMERCIAL,
                purpose: PropertyPurpose.SALE,
                status: PropertyStatus.AVAILABLE,
                price: 350000000,
                priceUnit: 'PKR',
                priceType: 'total',
                area: 25000,
                areaUnit: 'sqft',
                location: 'I-8 Markaz, Main Road',
                images: ['/assets/property-commercial.jpg'],
                features: ['Multiple Floors', 'Basement Parking', 'Elevator', 'Prime Location'],
                isFeatured: true,
            },
            {
                title: 'Modern Apartment - E-11',
                description: 'Beautiful 3-bedroom apartment with modern amenities. Perfect for families seeking comfortable urban living.',
                type: PropertyType.RESIDENTIAL,
                purpose: PropertyPurpose.RENT,
                status: PropertyStatus.RENTED,
                price: 180000,
                priceUnit: 'PKR',
                priceType: 'monthly',
                area: 2100,
                areaUnit: 'sqft',
                location: 'E-11/4, Multi Gardens',
                images: ['/assets/property-residential.jpg'],
                features: ['3 Bedrooms', '2 Bathrooms', 'Balcony', 'Community Pool', 'Gym'],
                isFeatured: false,
            },
        ];

        for (const property of properties) {
            await prisma.property.create({ data: property });
        }
        console.log(`✅ Created ${properties.length} sample properties\n`);
    } else {
        console.log(`ℹ️  ${propertyCount} properties already exist in database\n`);
    }

    console.log('🎉 Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
