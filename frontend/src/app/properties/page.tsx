import { Metadata } from 'next';
import { api } from '@/lib/api';
import PropertiesClient from '@/components/property/PropertiesClient';
import { Property } from '@/types/property';

export const metadata: Metadata = {
    title: "Property Listings in Islamabad | Square21 Marketing",
    description: "Browse our exclusive portfolio of industrial, commercial, and residential properties for rent and sale across Islamabad's CDA sectors.",
};

export default async function PropertiesPage() {
    let initialProperties: Property[] = [];
    try {
        initialProperties = await api.getProperties() as Property[];
    } catch (error) {
        console.error('Error fetching initial properties:', error);
    }

    return <PropertiesClient initialProperties={initialProperties} />;
}
