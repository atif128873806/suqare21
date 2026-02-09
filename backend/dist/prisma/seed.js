"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcrypt"));
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Starting database seeding...\n');
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
    }
    else {
        console.log('ℹ️  Admin user already exists.');
    }
    const propertyCount = await prisma.property.count();
    if (propertyCount === 0) {
        const properties = [
            {
                title: 'Premium Industrial Warehouse - I-9',
                description: 'Large industrial warehouse with modern facilities, ideal for manufacturing or logistics. Features loading docks, high ceilings, and 24/7 security.',
                type: client_1.PropertyType.INDUSTRIAL,
                purpose: client_1.PropertyPurpose.RENT,
                status: client_1.PropertyStatus.AVAILABLE,
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
                type: client_1.PropertyType.COMMERCIAL,
                purpose: client_1.PropertyPurpose.LEASE,
                status: client_1.PropertyStatus.AVAILABLE,
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
                type: client_1.PropertyType.RESIDENTIAL,
                purpose: client_1.PropertyPurpose.RENT,
                status: client_1.PropertyStatus.AVAILABLE,
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
                type: client_1.PropertyType.INDUSTRIAL,
                purpose: client_1.PropertyPurpose.RENT,
                status: client_1.PropertyStatus.AVAILABLE,
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
                type: client_1.PropertyType.COMMERCIAL,
                purpose: client_1.PropertyPurpose.SALE,
                status: client_1.PropertyStatus.AVAILABLE,
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
                type: client_1.PropertyType.RESIDENTIAL,
                purpose: client_1.PropertyPurpose.RENT,
                status: client_1.PropertyStatus.RENTED,
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
    }
    else {
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
//# sourceMappingURL=seed.js.map