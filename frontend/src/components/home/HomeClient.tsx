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
import TestimonialsSection from './TestimonialsSection';
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
            icon: Building2,
            title: 'Commercial Sales & Leasing',
            description: 'High-yield retail and office spaces in Blue Area, F-8, and I-8. Average ROI 6-8% annually.',
            areas: ['Blue Area', 'F-8 Markaz', 'I-8 Markaz'],
        },
        {
            icon: Warehouse,
            title: 'Industrial Properties',
            description: 'Warehousing and manufacturing facilities. 5,000 to 50,000+ sq ft available for immediate possession.',
            areas: ['I-9', 'I-10', 'Humak', 'Rawat'],
        },
        {
            icon: Home,
            title: 'Residential Sales & Rent',
            description: 'Premium houses and apartments in CDA sectors. Rentals from PKR 150k to 1M+. Sales from 50M+.',
            areas: ['F-6', 'F-7', 'E-7', 'DHA'],
        },
        {
            icon: TrendingUp,
            title: 'Market Analysis & Valuation',
            description: 'Data-backed property appraisals and investment strategies based on current Islamabad market trends.',
            areas: ['Islamabad Capital Territory'],
        },
    ];

    const stats = [
        { number: 450, suffix: '+', label: 'Active Listings' },
        { number: 6, suffix: '+', label: 'Years in Islamabad' },
        { number: 2.5, suffix: 'B+', label: 'Volume Handled (PKR)' },
        { number: 8, suffix: '', label: 'Specialized Brokers' },
    ];

    const whyUs = [
        { icon: CheckCircle, title: 'Verified Assets', description: 'Clear titles, verified owners, zero disputes' },
        { icon: Users, title: 'Local Authority', description: 'Sector-specific brokers with deep market data' },
        { icon: Award, title: 'Aggressive Negotiation', description: 'We focus strictly on your ROI and target price' },
        { icon: Clock, title: 'Rapid Execution', description: 'Streamlined legal and transfer processes' },
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
                <div className="bg-texture-grain mix-blend-overlay opacity-20 pointer-events-none" />

                <div className="relative z-10 section-container py-12 md:py-20 pb-32 md:pb-20">
                    <div className="w-full mx-auto text-center">
                        <div className="max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-1 mb-5 animate-fade-in">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                <span className="text-white/90 text-sm font-semibold tracking-wide">ISLAMABAD REAL ESTATE</span>
                            </div>

                            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4 animate-slide-up tracking-tight">
                                Square21
                                <span className="block text-secondary drop-shadow-md">Marketing</span>
                            </h1>

                            <p className="text-white/80 text-sm md:text-lg mb-8 animate-slide-up leading-relaxed font-body max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
                                Direct access to prime commercial, industrial, and residential properties across Islamabad. Data-driven valuations, clear pricing, and zero friction from listing to closing.
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
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 tracking-tight">New on the Market</h2>
                        <p className="text-muted-foreground font-medium">Latest commercial and residential inventory secured by our brokers.</p>
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
                            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 tracking-tight">Residential Sales & Rentals</h2>
                            <p className="text-muted-foreground font-medium">Premium properties in F, E, and G sectors. Verified owners, clear titles.</p>
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
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4 tracking-tight">
                        Ready to Acquire or Lease?
                    </h2>
                    <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 font-medium">
                        Speak directly with a broker specialized in your target sector. We handle negotiations, legal documentation, and secure transfers.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {/* <a href="tel:+923083333818">
                            <Button variant="outline" size="xl" className="border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors duration-300">
                                <Phone className="w-5 h-5 mr-2" />
                                Call Us Now
                            </Button>
                        </a> */}
                        <a href="https://wa.me/923083333818" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="xl" className="border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors duration-300">
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
            {/* Services Section - Bento Grid Style */}
            {/* <section className="py-24 bg-background">
                <div className="section-container">
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 mb-4">
                                <span className="w-8 h-[2px] bg-secondary" />
                                <span className="text-primary text-sm font-bold uppercase tracking-widest">Core Operations</span>
                            </div>
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
                                Islamabad Brokerage Services
                            </h2>
                        </div>
                        <p className="text-muted-foreground md:max-w-sm text-balance font-medium">
                            We focus on high-value transactions across CDA sectors. Accurate market data, strict legal compliance, and aggressive negotiation.
                        </p>
                    </div> */}

                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]"> */}
                        {/* {services.map((service, index) => { */}
                            {/* // Make first and last items span 2 columns on tablet/desktop for bento effect */}
                            {/* const isLarge = index === 0 || index === 3; */}
                            {/* return ( */}
                                {/* <div
                                    // key={index}
                                    className={`group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 ${isLarge ? 'md:col-span-2' : 'md:col-span-1'
                                        }`}
                                > */}
                                    {/* Decorative gradient overlay */}
                                    {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 h-full flex flex-col">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                                            <service.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                                        </div>

                                        <h3 className="font-display text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                                            {service.title}
                                        </h3>

                                        <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                                            {service.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {service.areas.map((area) => (
                                                <span key={area} className="text-xs font-medium px-3 py-1.5 bg-muted/50 rounded-lg text-primary/80 border border-primary/10">
                                                    {area}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            {/* <GallerySection /> */}

            {/* Our Agents Section - Professional Redesign */}
            {/* <section className="py-24 bg-muted/20">
                <div className="section-container">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center gap-2 mb-4 mx-auto">
                            <span className="w-12 h-[2px] bg-secondary" />
                            <span className="text-primary text-sm font-bold uppercase tracking-widest">The Brokerage Team</span>
                            <span className="w-12 h-[2px] bg-secondary" />
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                            Sector Specialists
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                            Our brokers cover specific territories within Islamabad. You deal directly with the designated expert for your target area.
                        </p>
                    </div> */}

            {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {agents.map((agent, index) => (
                            <div key={index} className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/60 hover:shadow-xl hover:border-secondary/30 transition-all duration-500 group flex flex-col h-full"> */}
            {/* Agent Image Container */}
            {/* <div className="relative h-72 w-full overflow-hidden bg-muted">
                                    <Image
                                        src={agent.image}
                                        alt={agent.name}
                                        fill
                                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                                    {/* Verification Badge */}
            {/* <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg transform translate-y-0 opacity-100 transition-all duration-300">
                                        <CheckCircle className="w-3.5 h-3.5 text-success fill-success/20" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Verified</span>
                                    </div> */}

            {/* Social Links on Hover */}
            {/* <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
                                        <a href={agent.socials.facebook} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-colors">
                                            <Facebook className="w-4 h-4" />
                                        </a>
                                        <a href={agent.socials.linkedin} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-colors">
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                        <a href={agent.socials.instagram} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-colors">
                                            <Instagram className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div> */}

            {/* Agent Info */}
            {/* <div className="p-6 flex flex-col flex-grow bg-card relative z-10">
                                    <div className="text-center mb-6">
                                        <h3 className="font-display text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                            {agent.name}
                                        </h3>
                                        <p className="text-secondary font-medium text-sm tracking-wide">
                                            Real Estate Consultant
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-6 flex-grow border-t border-border/50 pt-5">
                                        <a href={`tel:${agent.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-secondary/5 transition-colors group/link">
                                            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover/link:bg-secondary group-hover/link:text-white text-secondary transition-colors">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-foreground group-hover/link:text-secondary transition-colors">{agent.phone}</span>
                                        </a>
                                    </div>

                                    <div className="pt-5 border-t border-border/50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Properties</span>
                                            <span className="text-lg font-bold text-primary">{agent.listedProperties}</span>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold hover:bg-primary hover:text-white border-primary/20">
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}


            {/* Testimonials */}
            <TestimonialsSection />

        </div>
    );
}
