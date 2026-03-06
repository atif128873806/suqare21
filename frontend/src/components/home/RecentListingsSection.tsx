'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/property/PropertyCard';
import { Property } from '@/types/property';

interface RecentListingsSectionProps {
    properties: Property[];
}

export default function RecentListingsSection({ properties }: RecentListingsSectionProps) {
    return (
        <section className="py-16 bg-background">
            <div className="section-container">
                <div className="text-center mb-10">
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 tracking-tight">New on the Market</h2>
                    <p className="text-muted-foreground font-medium">Latest commercial and residential inventory secured by our brokers.</p>
                </div>

                <div className="relative">
                    {/* Mobile View - Vertical Stack */}
                    <div className="md:hidden flex flex-col gap-6">
                        {properties.slice(0, 6).map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>

                    {/* Desktop/Tablet View - Horizontal Scroll */}
                    <div className="hidden md:flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                        {properties.slice(0, 6).map((property) => (
                            <div key={property.id} className="flex-none w-[45%] lg:w-[32%] snap-start">
                                <PropertyCard property={property} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link href="/properties">
                        <Button variant="outline" className="group">
                            View All Properties
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
