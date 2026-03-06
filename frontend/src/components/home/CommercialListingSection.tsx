'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/property/PropertyCard';
import { Property } from '@/types/property';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';

interface CommercialListingSectionProps {
    properties: Property[];
}

export default function CommercialListingSection({ properties }: CommercialListingSectionProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) return;
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <section className="py-20 relative overflow-hidden">
            <Carousel
                setApi={setApi}
                opts={{ align: "start" }}
                className="w-full relative"
            >
                <CarouselPrevious className="flex w-10 h-10 lg:w-12 lg:h-12 bg-white/80 hover:bg-primary hover:text-white text-primary border-primary/20 shadow-lg left-4 z-10" />
                <CarouselNext className="flex w-10 h-10 lg:w-12 lg:h-12 bg-white/80 hover:bg-primary hover:text-white text-primary border-primary/20 shadow-lg right-4 z-10" />

                <div className="section-container">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 relative z-20">
                        <div>
                            <span className="text-secondary text-sm font-bold uppercase tracking-wider">High-Yield Assets</span>
                            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 tracking-tight">Commercial Inventory</h2>
                        </div>
                        <Link href="/properties?type=COMMERCIAL" className="mt-4 md:mt-0">
                            <Button variant="outline" className="group border-secondary text-secondary hover:bg-secondary hover:text-white">
                                View All Commercial
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="overflow-hidden">
                        <CarouselContent className="-ml-6">
                            {properties.map((property) => (
                                <CarouselItem key={property.id} className="pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                                    <PropertyCard property={property} />
                                </CarouselItem>
                            ))}
                            {properties.length === 0 && (
                                <div className="w-full py-12 text-center text-muted-foreground">
                                    No commercial properties available at the moment.
                                </div>
                            )}
                        </CarouselContent>
                    </div>

                    <div className="flex justify-center items-center gap-3 mt-10 relative z-20">
                        {Array.from({ length: count }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className="p-2 transition-all group"
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                <div className={`rounded-full transition-all ${index === current
                                    ? 'bg-primary w-8 h-2.5'
                                    : 'bg-primary/20 group-hover:bg-primary/40 w-2.5 h-2.5'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </Carousel>
        </section>
    );
}
