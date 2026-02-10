import { Metadata } from 'next';
import { api } from '@/lib/api';
import HomeClient from '@/components/home/HomeClient';
import { Property } from '@/types/property';

export const metadata: Metadata = {
  title: "Premium Real Estate in Islamabad | Square21 Marketing",
  description: "Discover Islamabad's finest industrial, commercial, and residential properties. Over 15 years of excellence in CDA sector real estate.",
};

export default async function HomePage() {
  let properties: Property[] = [];
  try {
    properties = await api.getProperties() as Property[];
  } catch (error) {
    console.error('Error fetching properties for home page:', error);
  }

  return <HomeClient initialProperties={properties} />;
}
