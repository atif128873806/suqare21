'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/property/PropertyCard';
import { ArrowRight, Building2, Warehouse, Home, TrendingUp, Phone, MessageCircle, CheckCircle, Users, Award, Clock } from 'lucide-react';
import Image from 'next/image';
import { Property } from '@/types/property';
import heroBuilding from '@/assets/hero-building.jpg';

interface HomeClientProps {
    initialProperties: Property[];
}

export default function HomeClient({ initialProperties }: HomeClientProps) {
    const featuredProperties = initialProperties.filter((p) => p.isFeatured).slice(0, 3);

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
        { value: '500+', label: 'Properties Listed' },
        { value: '15+', label: 'Years Experience' },
        { value: '1000+', label: 'Happy Clients' },
        { value: '50+', label: 'Expert Agents' },
    ];

    const whyUs = [
        { icon: CheckCircle, title: 'Verified Listings', description: 'All properties are personally verified by our team' },
        { icon: Users, title: 'Expert Guidance', description: 'Dedicated agents with deep market knowledge' },
        { icon: Award, title: 'Best Deals', description: 'Competitive pricing and exclusive property access' },
        { icon: Clock, title: 'Quick Process', description: 'Streamlined processes for faster transactions' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${heroBuilding.src})` }}
                />
                <div className="hero-overlay" />

                <div className="relative z-10 section-container py-20">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <span className="text-white/90 text-sm">Islamabad&apos;s Trusted Real Estate Partner</span>
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-slide-up">
                            Find Your Perfect
                            <span className="block text-primary">Property in Islamabad</span>
                        </h1>

                        <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Premium industrial, commercial, and residential properties across CDA sectors. Your trusted partner for buying, renting, and leasing.
                        </p>

                        <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link href="/properties">
                                <Button variant="hero" size="xl">
                                    Browse Properties
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <a href="https://wa.me/923083333818" target="_blank" rel="noopener noreferrer">
                                <Button variant="heroOutline" size="xl">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    WhatsApp Us
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-md border-t border-white/10">
                    <div className="section-container py-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <p className="font-display text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                                    <p className="text-secondary-foreground/70 text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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

            {/* Featured Properties */}
            <section className="py-20">
                <div className="section-container">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                        <div>
                            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Featured Listings</span>
                            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Premium Properties</h2>
                        </div>
                        <Link href="/properties" className="mt-4 md:mt-0">
                            <Button variant="outline" className="group">
                                View All Properties
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProperties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-secondary text-secondary-foreground">
                <div className="section-container">
                    <div className="text-center mb-12">
                        <span className="text-primary text-sm font-semibold uppercase tracking-wider">Why Square21</span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">Why Choose Us</h2>
                        <p className="text-secondary-foreground/70 max-w-2xl mx-auto">
                            With over 15 years of experience in Islamabad&apos;s real estate market, we deliver excellence in every transaction.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyUs.map((item, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-8 h-8 text-primary-foreground" />
                                </div>
                                <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                                <p className="text-secondary-foreground/70 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
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
                        <a href="tel:+923083333818">
                            <Button variant="heroOutline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                <Phone className="w-5 h-5 mr-2" />
                                Call Us Now
                            </Button>
                        </a>
                        <a href="https://wa.me/923083333818" target="_blank" rel="noopener noreferrer">
                            <Button variant="whatsapp" size="xl">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                WhatsApp Us
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
