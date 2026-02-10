'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Warehouse, Building2, Home, TrendingUp, CheckCircle, ArrowRight, Phone, MessageCircle } from 'lucide-react';

export default function ServicesPage() {
    const services = [
        {
            icon: Warehouse,
            title: 'Industrial Rentals',
            description: 'Premium industrial properties for manufacturing, warehousing, and logistics operations across I-9, I-10, Humak, and Rawat industrial areas.',
            features: [
                'Warehouses from 5,000 to 50,000 sq ft',
                'Manufacturing facilities',
                'Cold storage units',
                'Loading docks and transport access',
                'Security and surveillance',
                'Utility connections',
            ],
            areas: ['I-9', 'I-10', 'Humak', 'Rawat'],
        },
        {
            icon: Building2,
            title: 'Commercial Leasing & Sales',
            description: 'Prime commercial properties in key business districts for offices, retail, and mixed-use developments.',
            features: [
                'Office spaces from 500 to 10,000 sq ft',
                'Retail shops and showrooms',
                'Business centers',
                'Shopping plazas',
                'Modern amenities',
                'Prime locations',
            ],
            areas: ['Blue Area', 'I-8 to I-11', 'F-6', 'F-8'],
        },
        {
            icon: Home,
            title: 'Residential Rentals',
            description: 'Quality residential properties for rent and lease in Islamabad\'s most desirable neighborhoods.',
            features: [
                'Apartments and flats',
                'Independent houses',
                'Penthouses',
                'Gated communities',
                'Furnished and unfurnished options',
                'Long and short-term leases',
            ],
            areas: ['F-Sectors', 'E-Sectors', 'G-Sectors', 'DHA'],
        },
        {
            icon: TrendingUp,
            title: 'Property Valuation',
            description: 'Professional property valuation services to help you make informed investment decisions.',
            features: [
                'Market analysis and research',
                'Comparative property assessment',
                'Investment potential evaluation',
                'Legal compliance verification',
                'Detailed valuation reports',
                'Expert consultation',
            ],
            areas: ['All CDA Sectors'],
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="bg-secondary text-secondary-foreground py-20">
                <div className="section-container">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wider">What We Do</span>
                    <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">Our Services</h1>
                    <p className="text-secondary-foreground/70 max-w-2xl">
                        Comprehensive real estate solutions tailored to meet your industrial, commercial, and residential property needs in Islamabad.
                    </p>
                </div>
            </section>

            {/* Services */}
            <section className="py-20">
                <div className="section-container space-y-16">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                    <service.icon className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="font-display text-3xl font-bold mb-4">{service.title}</h2>
                                <p className="text-muted-foreground text-lg mb-6">{service.description}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {service.areas.map((area) => (
                                        <span key={area} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <Link href="/properties">
                                        <Button variant="default" className="group">
                                            View Properties
                                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                    <Link href="/contact">
                                        <Button variant="outline">Contact Us</Button>
                                    </Link>
                                </div>
                            </div>

                            <div className={`bg-card rounded-xl border border-border p-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                <h3 className="font-display text-xl font-semibold mb-4">Key Features</h3>
                                <div className="space-y-3">
                                    {service.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-primary">
                <div className="section-container text-center">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                        Need Expert Property Advice?
                    </h2>
                    <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                        Our team is ready to help you find the perfect property solution for your needs. Get in touch with us today.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="tel:+923001234567">
                            <Button variant="heroOutline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                <Phone className="w-5 h-5 mr-2" />
                                Call Us Now
                            </Button>
                        </a>
                        <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
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
