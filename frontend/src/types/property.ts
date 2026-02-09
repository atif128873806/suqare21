export type PropertyType = 'INDUSTRIAL' | 'COMMERCIAL' | 'RESIDENTIAL';
export type PropertyPurpose = 'RENT' | 'LEASE' | 'SALE';
export type PropertyStatus = 'AVAILABLE' | 'RENTED' | 'SOLD';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  price: number;
  priceUnit: 'PKR' | 'USD';
  priceType: 'monthly' | 'yearly' | 'total';
  area: number;
  areaUnit: 'sqft' | 'sqm' | 'marla' | 'kanal';
  location: string;
  mapHtml?: string;
  features: string[];
  images: (string | { src: string; height: number; width: number; blurDataURL?: string })[];
  videos?: string[];
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyFilter {
  type?: PropertyType;
  purpose?: PropertyPurpose;
  location?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  budget?: number;
  preferredArea?: string;
  propertyType?: PropertyType;
  purpose?: PropertyPurpose;
  message?: string;
  source: 'website' | 'chatbot' | 'whatsapp';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt: Date;
}
