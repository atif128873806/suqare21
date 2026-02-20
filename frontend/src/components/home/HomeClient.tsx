'use client';
import { useState, useMemo, useEffect } from 'react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/property/PropertyCard';
import HeroSearch from '@/components/home/HeroSearch';
import { ArrowRight, Building2, Warehouse, Home, TrendingUp, Phone, MessageCircle, CheckCircle, Users, Award, Clock, Facebook, Linkedin, Instagram } from 'lucide-react';
import Image from 'next/image';
import { Property } from '@/types/property';
import heroBuilding from '@/assets/hero-building.jpg';
import Counter from '@/components/ui/counter';
import GallerySection from './GallerySection';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';
interface HomeClientProps {
    initialProperties: Property[];
}

export default function HomeClient({ initialProperties }: HomeClientProps) {
    const [residentialApi, setResidentialApi] = useState<CarouselApi>();
    const [commercialApi, setCommercialApi] = useState<CarouselApi>();

    const [residentialCurrent, setResidentialCurrent] = useState(0);
    const [residentialCount, setResidentialCount] = useState(0);

    const [commercialCurrent, setCommercialCurrent] = useState(0);
    const [commercialCount, setCommercialCount] = useState(0);

    const residentialProperties = useMemo(() =>
        initialProperties.filter((p) => p.type === 'RESIDENTIAL'),
        [initialProperties]
    );

    const commercialProperties = useMemo(() =>
        initialProperties.filter((p) => p.type === 'COMMERCIAL'),
        [initialProperties]
    );

    useEffect(() => {
        if (!residentialApi) return;
        setResidentialCount(residentialApi.scrollSnapList().length);
        setResidentialCurrent(residentialApi.selectedScrollSnap());
        residentialApi.on("select", () => {
            setResidentialCurrent(residentialApi.selectedScrollSnap());
        });
    }, [residentialApi]);

    useEffect(() => {
        if (!commercialApi) return;
        setCommercialCount(commercialApi.scrollSnapList().length);
        setCommercialCurrent(commercialApi.selectedScrollSnap());
        commercialApi.on("select", () => {
            setCommercialCurrent(commercialApi.selectedScrollSnap());
        });
    }, [commercialApi]);

    const services = [
        {
            icon: Warehouse,
            title: 'Industrial Rentals',
            description: 'Premium industrial properties in I-9, I-10, Humak, and Rawat for manufacturing and logistics.',
            areas: ['I-9', 'I-10', 'Humak', 'Rawat'],
        },
        {
            icon: Building2,
            title: 'Commercial Spaces',
            description: 'Prime commercial properties for lease and sale in key CDA sectors of Islamabad.',
            areas: ['I-8 to I-11', 'F-6', 'F-8', 'Blue Area'],
        },
        {
            icon: Home,
            title: 'Residential Rentals',
            description: 'Quality residential properties for rent and lease across Islamabad\'s best neighborhoods.',
            areas: ['F-Sectors', 'E-Sectors', 'G-Sectors'],
        },
        {
            icon: TrendingUp,
            title: 'Property Valuation',
            description: 'Professional valuation services for investors and landlords to maximize returns.',
            areas: ['All CDA Sectors'],
        },
    ];

    const stats = [
        { number: 500, suffix: '+', label: 'Properties Listed' },
        { number: 6, suffix: '+', label: 'Years Experience' },
        { number: 1000, suffix: '+', label: 'Happy Clients' },
        { number: 8, suffix: '+', label: 'Expert Agents' },
    ];

    const whyUs = [
        { icon: CheckCircle, title: 'Verified Listings', description: 'All properties are personally verified by our team' },
        { icon: Users, title: 'Expert Guidance', description: 'Dedicated agents with deep market knowledge' },
        { icon: Award, title: 'Best Deals', description: 'Competitive pricing and exclusive property access' },
        { icon: Clock, title: 'Quick Process', description: 'Streamlined processes for faster transactions' },
    ];

    const agents = [
        {
            name: 'Furqan Ur Rehman Khattak',
            phone: '+92 300 855 6388',
            email: 'Info@brighthomesonline.com',
            listedProperties: 175,
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
            socials: { facebook: '#', linkedin: '#', instagram: '#' }
        },
        {
            name: 'Rao Sharif Luqman',
            phone: '+92 300 855 6388',
            email: 'Info@brighthomesonline.com',
            listedProperties: 17,
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
            socials: { facebook: '#', linkedin: '#', instagram: '#' }
        },
        {
            name: 'Maqbool Ur Rehman',
            phone: '+92 300 855 6388',
            email: 'Info@brighthomesonline.com',
            listedProperties: 26,
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
            socials: { facebook: '#', linkedin: '#', instagram: '#' }
        },
        {
            name: 'Muzammil Shahzad',
            phone: '+92 300 855 6388',
            email: 'Info@brighthomesonline.com',
            listedProperties: 22,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
            socials: { facebook: '#', linkedin: '#', instagram: '#' }
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            {/* Hero Section with Video Background */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/videos/hero-video.mp4" type="video/mp4" />
                </video>

                <div className="hero-overlay" />

                <div className="relative z-10 section-container py-12 md:py-20 pb-32 md:pb-20">
                    <div className="w-full mx-auto text-center">
                        <div className="max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-1 mb-5 animate-fade-in">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                <span className="text-white/90 text-sm">Pakistan Most Trusted Agency</span>
                            </div>

                            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 animate-slide-up tracking-tight">
                                Square21
                                <span className="block text-primary">Marketing</span>
                            </h1>

                            <p className="text-white/80 text-sm md:text-lg mb-8 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
                                Your trusted partner for commercial, industrial, and residential properties in Islamabad. We are dedicated to making your real estate journey smooth, successful, and rewarding.
                            </p>
                        </div>

                        {/* Hero Search Component */}
                        <HeroSearch />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-primary/95 backdrop-blur-md border-t border-white/10">
                    <div className="section-container py-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <p className="font-display text-2xl md:text-3xl font-bold text-secondary">
                                        <Counter end={stat.number} suffix={stat.suffix} />
                                    </p>
                                    <p className="text-secondary-foreground/70 text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


            </section>

            {/* Recent Listings Section */}
            <section className="py-16 bg-background">
                <div className="section-container">
                    <div className="text-center mb-10">
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Recent Listings</h2>
                        <p className="text-muted-foreground">Check out some of our latest properties.</p>
                    </div>

                    {/* Mobile: Vertical Stack, Desktop: Horizontal Scroll */}
                    <div className="relative">
                        {/* Mobile View - Vertical Stack */}
                        <div className="md:hidden flex flex-col gap-6">
                            {initialProperties.slice(0, 6).map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>

                        {/* Desktop/Tablet View - Horizontal Scroll */}
                        <div className="hidden md:flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                            {initialProperties.slice(0, 6).map((property) => (
                                <div key={property.id} className="flex-none w-[45%] lg:w-[32%] snap-start">
                                    <PropertyCard property={property} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* View All Button */}
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

            {/* Residential Listing Section */}
            <section className="py-16 bg-muted/30 relative overflow-hidden">
                <Carousel
                    setApi={setResidentialApi}
                    opts={{ align: "start" }}
                    className="w-full relative"
                >
                    <CarouselPrevious className="flex w-10 h-10 lg:w-12 lg:h-12 bg-white/80 hover:bg-primary hover:text-white text-primary border-primary/20 shadow-lg left-4 z-10" />
                    <CarouselNext className="flex w-10 h-10 lg:w-12 lg:h-12 bg-white/80 hover:bg-primary hover:text-white text-primary border-primary/20 shadow-lg right-4 z-10" />

                    <div className="section-container">
                        <div className="text-center mb-10">
                            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Residential Listing</h2>
                            <p className="text-muted-foreground">Check out some of our Rental properties.</p>
                        </div>

                        {/* Property Grid with simple transition effect */}
                        <div className="overflow-hidden">
                            <CarouselContent className="-ml-6">
                                {residentialProperties.map((property) => (
                                    <CarouselItem key={property.id} className="pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                                        <PropertyCard property={property} />
                                    </CarouselItem>
                                ))}
                                {residentialProperties.length === 0 && (
                                    <div className="w-full py-12 text-center text-muted-foreground">
                                        No residential properties available at the moment.
                                    </div>
                                )}
                            </CarouselContent>
                        </div>

                        {/* Pagination Dots - Centered below grid for all devices */}
                        <div className="flex justify-center items-center gap-3 mt-10 relative z-20">
                            {Array.from({ length: residentialCount }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => residentialApi?.scrollTo(index)}
                                    className={`rounded-full transition-all ${index === residentialCurrent
                                        ? 'bg-primary w-8 h-2.5'
                                        : 'bg-primary/20 hover:bg-primary/40 w-2.5 h-2.5'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </Carousel>
            </section>


            {/* CTA Section */}
            <section className="py-20 bg-primary">
                <div className="section-container text-center">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                        Ready to Find Your Perfect Property?
                    </h2>
                    <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                        Let our expert team help you discover the ideal property that matches your requirements and budget.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {/* <a href="tel:+923083333818">
                            <Button variant="heroOutline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                <Phone className="w-5 h-5 mr-2" />
                                Call Us Now
                            </Button>
                        </a> */}
                        <a href="https://wa.me/923083333818" target="_blank" rel="noopener noreferrer">
                            <Button variant="heroOutline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                WhatsApp Us
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Commercial Listing Section */}
            <section className="py-20 relative overflow-hidden">
                <Carousel
                    setApi={setCommercialApi}
                    opts={{ align: "start" }}
                    className="w-full relative"
                >
                    <CarouselPrevious className="flex w-10 h-10 lg:w-12 lg:h-12 bg-white/80 hover:bg-primary hover:text-white text-primary border-primary/20 shadow-lg left-4 z-10" />
                    <CarouselNext className="flex w-10 h-10 lg:w-12 lg:h-12 bg-white/80 hover:bg-primary hover:text-white text-primary border-primary/20 shadow-lg right-4 z-10" />

                    <div className="section-container">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 relative z-20">
                            <div>
                                <span className="text-primary text-sm font-semibold uppercase tracking-wider">Commercial Properties</span>
                                <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Commercial Listing</h2>
                            </div>
                            <Link href="/properties?type=COMMERCIAL" className="mt-4 md:mt-0">
                                <Button variant="outline" className="group">
                                    View All Commercial
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>

                        {/* Property Grid with simple transition effect */}
                        <div className="overflow-hidden">
                            <CarouselContent className="-ml-6">
                                {commercialProperties.map((property) => (
                                    <CarouselItem key={property.id} className="pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                                        <PropertyCard property={property} />
                                    </CarouselItem>
                                ))}
                                {commercialProperties.length === 0 && (
                                    <div className="w-full py-12 text-center text-muted-foreground">
                                        No commercial properties available at the moment.
                                    </div>
                                )}
                            </CarouselContent>
                        </div>

                        {/* Pagination Dots - Centered below grid */}
                        <div className="flex justify-center items-center gap-3 mt-10 relative z-20">
                            {Array.from({ length: commercialCount }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => commercialApi?.scrollTo(index)}
                                    className={`rounded-full transition-all ${index === commercialCurrent
                                        ? 'bg-primary w-8 h-2.5'
                                        : 'bg-primary/20 hover:bg-primary/40 w-2.5 h-2.5'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </Carousel>
            </section>
            {/* Services Section */}
            <section className="py-20 bg-muted/30">
                <div className="section-container">
                    <div className="text-center mb-12">
                        <span className="text-primary text-sm font-semibold uppercase tracking-wider">Our Services</span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">What We Offer</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive real estate services tailored to meet your investment and occupancy needs in Islamabad&apos;s prime locations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                    <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                                </div>
                                <h3 className="font-display text-xl font-semibold mb-2">{service.title}</h3>
                                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {service.areas.map((area) => (
                                        <span key={area} className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            {/* <GallerySection /> */}

            {/* Our Agents Section */}
            {/* <section className="py-24 bg-[#f8f9fa]"> */}
            {/* <div className="section-container">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">Our Agents</h2>
                        <div className="w-24 h-1 bg-primary mx-auto mb-6 opacity-30"></div>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Our highly qualified agents will help you to find a best deal in town
                        </p>
                    </div> */}

            {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {agents.map((agent, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 pt-12 shadow-sm border border-border/50 hover:shadow-xl transition-all duration-500 group relative mt-10"> */}
            {/* Agent Image Container */}
            {/* <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-500">
                                    <Image
                                        src={agent.image}
                                        alt={agent.name}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-cover"
                                    />
                                </div> */}

            {/* <div className="text-center">
                                    <div className="flex items-center justify-center gap-1.5 mb-3 mt-4">
                                        <h3 className="font-display text-xl font-bold text-[#1a1a1a] group-hover:text-primary transition-colors">
                                            {agent.name}
                                        </h3>
                                        <div className="bg-[#00a3ff] rounded-full p-0.5">
                                            <CheckCircle className="w-3.5 h-3.5 text-white fill-current" />
                                        </div>
                                    </div> */}

            {/* <div className="space-y-1.5 mb-6">
                                        <p className="text-primary font-semibold text-sm">
                                            {agent.phone}
                                        </p>
                                        <p className="text-muted-foreground text-[13px] break-all">
                                            {agent.email}
                                        </p>
                                    </div> */}

            {/* <div className="mb-8 p-4 bg-muted/30 rounded-xl group-hover:bg-primary/5 transition-colors duration-500">
                                        <p className="text-primary text-2xl font-bold mb-1">{agent.listedProperties}</p>
                                        <p className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">Listed Properties</p>
                                    </div>

                                    <div className="flex justify-center items-center gap-4">
                                        <a href={agent.socials.facebook} className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300">
                                            <Facebook className="w-4 h-4" />
                                        </a>
                                        <a href={agent.socials.linkedin} className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300">
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                        <a href={agent.socials.instagram} className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300">
                                            <Instagram className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}


        </div>
    );
}
