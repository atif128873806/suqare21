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
            <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
                <div className="bg-texture-grain" />
                {/* Subtle red gradient glow to tie into brand */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="section-container relative z-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-8 h-[2px] bg-secondary" />
                        <span className="text-secondary text-sm font-bold uppercase tracking-widest">Explore Our Portfolio</span>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-4 tracking-tight">Property Listings</h1>
                    <p className="text-primary-foreground/80 max-w-2xl font-medium">
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
