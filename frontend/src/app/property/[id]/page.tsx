import { Metadata } from 'next';
import { api } from '@/lib/api';
import PropertyDetailClient from '@/components/property/PropertyDetailClient';
import { Property } from '@/types/property';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = (await params).id;
    try {
        const property = await api.getProperty(id) as Property;

        const locationDescription = property.location.includes(' | ')
            ? property.location.split(' | ')[0]
            : property.location;

        return {
            title: `${property.title} in ${locationDescription}`,
            description: `${property.type} for ${property.purpose} in ${property.location}. Price: ${property.price} ${property.priceUnit}. ${property.description.replace(/<[^>]*>/g, '').slice(0, 160)}...`,
            openGraph: {
                title: property.title,
                description: `View details for this ${property.type} in ${locationDescription}`,
                images: property.images.map(img => typeof img === 'string' ? img : img.src),
            },
        };
    } catch {
        return {
            title: 'Property Not Found',
        };
    }
}

export default async function PropertyDetailPage({ params }: Props) {
    const id = (await params).id;

    try {
        const property = await api.getProperty(id) as Property;

        if (!property) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="font-display text-4xl font-bold mb-4">Property Not Found</h1>
                        <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
                        <Link href="/properties">
                            <Button>View All Properties</Button>
                        </Link>
                    </div>
                </div>
            );
        }

        return <PropertyDetailClient property={property} />;
    } catch (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-display text-4xl font-bold mb-4">Error Loading Property</h1>
                    <p className="text-muted-foreground mb-6">Something went wrong while fetching the property details.</p>
                    <Link href="/properties">
                        <Button>View All Properties</Button>
                    </Link>
                </div>
            </div>
        );
    }
}
