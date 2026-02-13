'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import { PropertyFilter, Property, PropertyType, PropertyPurpose } from '@/types/property';
import { useProperties } from '@/hooks/useProperties';

interface PropertiesClientProps {
    initialProperties: Property[];
}

export default function PropertiesClient({ initialProperties }: PropertiesClientProps) {
    const searchParams = useSearchParams();

    // Initialize filters from URL parameters
    const getInitialFilters = (): PropertyFilter => {
        const filters: PropertyFilter = {};

        const purpose = searchParams.get('purpose');
        const location = searchParams.get('location');
        const type = searchParams.get('type');

        if (purpose) filters.purpose = purpose as PropertyPurpose;
        if (location) filters.location = location;
        if (type) filters.type = type as PropertyType;

        return filters;
    };

    const [filters, setFilters] = useState<PropertyFilter>(getInitialFilters());

    const { properties, isLoading, error } = useProperties({
        filters,
        autoFetch: true // Since filters can change, we still need client-side fetching
    });

    const displayProperties = properties.length > 0 ? properties : (Object.keys(filters).length === 0 ? initialProperties : []);

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <section className="bg-secondary text-secondary-foreground py-20">
                <div className="section-container">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wider">Explore Our Portfolio</span>
                    <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">Property Listings</h1>
                    <p className="text-secondary-foreground/70 max-w-2xl">
                        Discover premium industrial, commercial, and residential properties across Islamabad&apos;s most sought-after locations.
                    </p>
                </div>
            </section>

            {/* Filters & Listings */}
            <section className="py-12">
                <div className="section-container">
                    {/* Filters */}
                    <div className="mb-8">
                        <PropertyFilters
                            filters={filters}
                            onFilterChange={setFilters}
                            onReset={() => setFilters({})}
                        />
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-muted-foreground">
                            {isLoading ? (
                                'Loading properties...'
                            ) : (
                                <>
                                    Showing <span className="font-semibold text-foreground">{displayProperties.length}</span> properties
                                </>
                            )}
                        </p>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-20">
                            <h3 className="font-display text-2xl font-semibold mb-2 text-destructive">Error Loading Properties</h3>
                            <p className="text-muted-foreground mb-4">{error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && !error && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                                    <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                                    <div className="h-6 bg-muted rounded mb-2"></div>
                                    <div className="h-4 bg-muted rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Property Grid */}
                    {!isLoading && !error && displayProperties.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && displayProperties.length === 0 && (
                        <div className="text-center py-20">
                            <h3 className="font-display text-2xl font-semibold mb-2">No Properties Found</h3>
                            <p className="text-muted-foreground mb-4">
                                Try adjusting your filters to find more properties.
                            </p>
                            <button
                                onClick={() => setFilters({})}
                                className="text-primary hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
