import { Property } from '@/types/property';
import propertyIndustrial from '@/assets/property-industrial.jpg';
import propertyCommercial from '@/assets/property-commercial.jpg';
import propertyResidential from '@/assets/property-residential.jpg';

export const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Premium Industrial Warehouse - I-9',
    description: 'Large industrial warehouse with modern facilities, ideal for manufacturing or logistics. Features loading docks, high ceilings, and 24/7 security.',
    type: 'INDUSTRIAL',
    purpose: 'RENT',
    status: 'AVAILABLE',
    price: 850000,
    priceUnit: 'PKR',
    priceType: 'monthly',
    area: 15000,
    areaUnit: 'sqft',
    location: 'I-9 | Islamabad | I-9 Industrial Area, Main Boulevard',
    features: ['Loading Docks', '24/7 Security', 'High Ceilings', 'Power Backup', 'Parking'],
    images: ['/assets/property-industrial.jpg'],
    isFeatured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Executive Office Space - F-8',
    description: 'Premium commercial office space in the heart of F-8. Modern architecture with panoramic views, perfect for corporate headquarters.',
    type: 'COMMERCIAL',
    purpose: 'LEASE',
    status: 'AVAILABLE',
    price: 2500000,
    priceUnit: 'PKR',
    priceType: 'monthly',
    area: 8500,
    areaUnit: 'sqft',
    location: 'F-8 | Islamabad | F-8 Markaz, Commercial Area',
    features: ['Reception Area', 'Conference Rooms', 'Pantry', 'Parking', 'Elevator Access'],
    images: [propertyCommercial],
    isFeatured: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'Luxury Penthouse - F-6',
    description: 'Stunning luxury penthouse with breathtaking city views. Features high-end finishes, private terrace, and smart home automation.',
    type: 'RESIDENTIAL',
    purpose: 'RENT',
    status: 'AVAILABLE',
    price: 450000,
    priceUnit: 'PKR',
    priceType: 'monthly',
    area: 4200,
    areaUnit: 'sqft',
    location: 'F-6 | Islamabad | F-6/3, Super Market Road',
    features: ['Private Terrace', 'Smart Home', 'Gym Access', 'Concierge', '2 Parking Spaces'],
    images: [propertyResidential],
    isFeatured: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '4',
    title: 'Industrial Unit - I-10',
    description: 'Modern industrial unit suitable for manufacturing or storage. Located in prime I-10 industrial zone with easy access to main highways.',
    type: 'INDUSTRIAL',
    purpose: 'RENT',
    status: 'AVAILABLE',
    price: 650000,
    priceUnit: 'PKR',
    priceType: 'monthly',
    area: 12000,
    areaUnit: 'sqft',
    location: 'I-10 | Islamabad | I-10/3 Industrial Area',
    features: ['Heavy Power Supply', 'Wide Entrance', 'Office Space', 'Security'],
    images: [propertyIndustrial],
    isFeatured: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '5',
    title: 'Commercial Plaza - I-8',
    description: 'Prime commercial plaza for sale in I-8. Excellent investment opportunity with high rental yield potential.',
    type: 'COMMERCIAL',
    purpose: 'SALE',
    status: 'AVAILABLE',
    price: 350000000,
    priceUnit: 'PKR',
    priceType: 'total',
    area: 25000,
    areaUnit: 'sqft',
    location: 'I-8 | Islamabad | I-8 Markaz, Main Road',
    features: ['Multiple Floors', 'Basement Parking', 'Elevator', 'Prime Location'],
    images: [propertyCommercial],
    isFeatured: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: '6',
    title: 'Modern Apartment - E-11',
    description: 'Beautiful 3-bedroom apartment with modern amenities. Perfect for families seeking comfortable urban living.',
    type: 'RESIDENTIAL',
    purpose: 'RENT',
    status: 'RENTED',
    price: 180000,
    priceUnit: 'PKR',
    priceType: 'monthly',
    area: 2100,
    areaUnit: 'sqft',
    location: 'E-11 | Islamabad | E-11/4, Multi Gardens',
    features: ['3 Bedrooms', '2 Bathrooms', 'Balcony', 'Community Pool', 'Gym'],
    images: [propertyResidential],
    isFeatured: false,
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-01-01')
  }
];

export const sectors = [
  'I-8', 'I-9', 'I-10', 'I-11',
  'F-6', 'F-7', 'F-8', 'F-10', 'F-11',
  'E-11', 'E-7',
  'G-6', 'G-8', 'G-9', 'G-10', 'G-11',
  'Blue Area',
  'Humak', 'Rawat'
];

export const formatPrice = (price: number, unit: string = 'PKR'): string => {
  if (price >= 10000000) {
    return `${unit} ${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `${unit} ${(price / 100000).toFixed(2)} Lac`;
  }
  return `${unit} ${price.toLocaleString()}`;
};
