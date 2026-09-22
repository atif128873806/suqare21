'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
    ArrowRight,
    MapPin,
    Phone,
    MessageCircle,
    CheckCircle,
    Users,
    Award,
    Clock,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import HeroSearch from '@/components/home/HeroSearch';
import { Property } from '@/types/property';
import Counter from '@/components/ui/counter';

const TestimonialsSection = dynamic(() => import('./TestimonialsSection'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-2xl" />
});

const RecentListingsSection = dynamic(() => import('./RecentListingsSection'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-muted/20 animate-pulse rounded-2xl" />
});

const ResidentialListingSection = dynamic(() => import('./ResidentialListingSection'), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-muted/20 animate-pulse rounded-2xl" />
});

const CommercialListingSection = dynamic(() => import('./CommercialListingSection'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-muted/20 animate-pulse rounded-2xl" />
});

const areaGuides = [
    {
        sector: 'I-10',
        label: 'I-10 Sector',
        description: 'Prime residential & commercial hub with CDA-approved plots, modern houses, and active markaz. Close to motorway access.',
        types: ['Residential', 'Commercial'],
        priceRange: '2.75 Cr – 8.75 Cr',
        highlights: ['Near Markaz', 'CDA Approved', 'Wide Roads'],
        image: 'https://res.cloudinary.com/dwufqlkzv/image/upload/v1771739432/square21/properties/fvtb5wpxtqf1vpo9bmwc.jpg',
    },
    {
        sector: 'I-9',
        label: 'I-9 Sector',
        description: "Islamabad's industrial backbone. Warehouses, factories, and commercial sheds near Dry Port Road with excellent logistics access.",
        types: ['Industrial', 'Warehouse'],
        priceRange: 'Rent from 150K/mo',
        highlights: ['Dry Port Access', 'Industrial Zone', 'High Ceilings'],
        image: 'https://res.cloudinary.com/dwufqlkzv/image/upload/v1771739850/square21/properties/qs5crmtnphtdit0ci4zn.jpg',
    },
    {
        sector: 'F-11',
        label: 'F-11 Sector',
        description: 'Elite residential area with modern apartments and luxury residences. F-11 Markaz is a premium commercial destination.',
        types: ['Apartments', 'Luxury'],
        priceRange: '1.50 – 2.50 Lac/mo',
        highlights: ['Premium Living', 'Furnished Options', 'Markaz Access'],
        image: 'https://res.cloudinary.com/dwufqlkzv/image/upload/v1772113174/square21/properties/et83lav9hghfayahd089.jpg',
    },
    {
        sector: 'F-8',
        label: 'F-8 Sector',
        description: "One of Islamabad's most prestigious sectors. High-demand commercial spaces and exclusive residential properties.",
        types: ['Commercial', 'Office Space'],
        priceRange: '20 Lac/mo',
        highlights: ['Prestigious Area', 'High Footfall', 'Blue Area Adjacent'],
        image: 'https://res.cloudinary.com/dwufqlkzv/image/upload/v1771740419/square21/properties/b3vwasrkxa6yx4wngfe9.jpg',
    },
    {
        sector: 'G-11',
        label: 'G-11 Sector',
        description: 'Growing residential sector with modern apartment complexes. Great value for families seeking quality living spaces.',
        types: ['Apartments', 'Residential'],
        priceRange: '1.85 Lac/mo',
        highlights: ['Family Friendly', 'Modern Buildings', 'Good Value'],
        image: 'https://res.cloudinary.com/dwufqlkzv/image/upload/v1772113174/square21/properties/rdbyqtwlkzxahbgbyccs.jpg',
    },
];

const recentDeals = [
    {
        type: 'Sold',
        title: 'Corner House – I-10/4',
        area: '6 Marla',
        price: 'PKR 7.00 Cr',
        timeline: 'Closed in 12 days',
        sector: 'I-10',
    },
    {
        type: 'Rented',
        title: 'Furnished Apartment – F-11/1',
        area: '18 West Residencia',
        price: 'PKR 2.50 Lac/mo',
        timeline: 'Closed in 5 days',
        sector: 'F-11',
    },
    {
        type: 'Rented',
        title: 'Commercial Building – I-10/1',
        area: '2,602 sqft',
        price: 'PKR 4.20 Lac/mo',
        timeline: 'Closed in 8 days',
        sector: 'I-10',
    },
    {
        type: 'Rented',
        title: 'RCC Warehouse – I-9',
        area: '11,000 sqft',
        price: 'PKR 1.50 Lac/mo',
        timeline: 'Closed in 3 days',
        sector: 'I-9',
    },
];

interface HomeClientProps {
    initialProperties: Property[];
}

export default function HomeClient({ initialProperties }: HomeClientProps) {
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const residentialProperties = useMemo(() =>
        initialProperties.filter((p) => p.type === 'RESIDENTIAL'),
        [initialProperties]
    );

    const commercialProperties = useMemo(() =>
        initialProperties.filter((p) => p.type === 'COMMERCIAL' || p.type === 'INDUSTRIAL'),
        [initialProperties]
    );

    useEffect(() => {
        videoRefs.current.forEach(v => v?.play().catch(() => { }));
    }, []);

    const heroVideos = [
        { src: '/videos/hero-property.mp4', label: 'Residential', location: 'I-10/4', badge: 'SOLD', badgeColor: 'bg-secondary' },
        { src: '/videos/hero-commercial.mp4', label: 'Commercial', location: 'F-8 Markaz', badge: 'AVAILABLE', badgeColor: 'bg-emerald-500' },
        { src: '/videos/hero-apartment.mp4', label: 'Apartment', location: 'F-11', badge: 'RENTED', badgeColor: 'bg-secondary' },
    ];

    const stats = [
        { number: initialProperties.length || 13, suffix: '', label: 'Active Listings' },
        { number: 5, suffix: '', label: 'Areas Covered' },
        { number: 14, suffix: '+', label: 'Happy Clients' },
        { number: 6, suffix: '+', label: 'Years Experience' },
    ];

    const whyUs = [
        { icon: CheckCircle, title: 'Verified Properties', description: 'Every listing is personally inspected. Clear titles, verified owners.' },
        { icon: Users, title: 'Sector Specialists', description: 'Our brokers know I-10, I-9, F-11 inside out — every street, every rate.' },
        { icon: Award, title: 'Transparent Pricing', description: 'No hidden fees. Market-rate pricing with honest negotiation.' },
        { icon: Clock, title: 'Fast Closings', description: 'Average 8-day closing time. We handle legal, CDA, and transfers.' },
    ];

    return (
        <div className="min-h-screen">
            {/* ========= HERO ========= */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-primary">
                {/* Ambient glows */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-secondary/[0.04] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/[0.03] rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />

                <div className="relative z-10 section-container pt-24 sm:pt-28 pb-28 sm:pb-32 flex flex-col items-center justify-center min-h-screen gap-8 sm:gap-10">

                    {/* Headline block — always centered */}
                    <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-5">
                        <h1 className="text-white font-display text-[2.2rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            We Close Deals
                            <br />
                            <span className="text-secondary">Across Islamabad</span>
                        </h1>
                        <p className="text-white/40 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mx-auto">
                            Verified residential, commercial &amp; industrial properties in I-10, I-9, F-11, F-8 and G-11.
                        </p>
                    </div>

                    {/* Video showcase strip — 3 cards */}
                    <div className="w-full max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto">
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-5 lg:gap-6">
                            {heroVideos.map((vid, i) => (
                                <div key={i} className="group relative rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-white/[0.08] hover:ring-secondary/40 transition-all duration-500 cursor-pointer shadow-xl shadow-black/20">
                                    <video
                                        ref={el => { videoRefs.current[i] = el; }}
                                        autoPlay loop muted playsInline
                                        preload="metadata"
                                        className="w-full aspect-[9/14] sm:aspect-[9/15] lg:aspect-[9/13] object-cover group-hover:scale-105 transition-transform duration-700"
                                    >
                                        <source src={vid.src} type="video/mp4" />
                                    </video>

                                    {/* Badge */}
                                    <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5">
                                        <span className={`${vid.badgeColor} text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full`}>
                                            {vid.badge}
                                        </span>
                                    </div>

                                    {/* Bottom gradient + label */}
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 sm:p-3 pt-8 sm:pt-12">
                                        <p className="text-white font-semibold text-[11px] sm:text-sm leading-tight">{vid.label}</p>
                                        <p className="text-white/40 text-[9px] sm:text-xs mt-0.5 flex items-center gap-1">
                                            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            {vid.location}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="w-full max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto">
                        <HeroSearch />
                    </div>
                </div>

                {/* Stats bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/[0.03] backdrop-blur-md border-t border-white/[0.06]">
                    <div className="section-container py-4 sm:py-5">
                        <div className="grid grid-cols-4 gap-2 sm:gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <p className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-secondary">
                                        <Counter end={stat.number} suffix={stat.suffix} />
                                    </p>
                                    <p className="text-white/35 text-[10px] sm:text-xs md:text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========= RECENT LISTINGS ========= */}
            <RecentListingsSection properties={initialProperties} />

            {/* ========= AREA GUIDES ========= */}
            <section className="py-20 bg-muted/30">
                <div className="section-container">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 mb-3">
                            <span className="w-8 h-[2px] bg-secondary" />
                            <span className="text-primary font-bold uppercase tracking-widest text-[13px]">Explore Areas</span>
                            <span className="w-8 h-[2px] bg-secondary" />
                        </div>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-tight">
                            Islamabad Sector Guide
                        </h2>
                        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                            We specialize in these high-demand sectors. Each one has been carefully selected based on investment potential and market activity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                        {areaGuides.map((area) => (
                            <Link
                                key={area.sector}
                                href={`/properties?location=${area.sector}`}
                                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover:border-secondary/30"
                            >
                                <div className="relative overflow-hidden h-44 sm:h-48">
                                    <Image
                                        src={area.image}
                                        alt={area.label}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5">
                                        <span className="text-secondary text-xs sm:text-sm font-bold tracking-wider">{area.sector}</span>
                                        <h3 className="text-white font-display text-lg sm:text-xl font-bold">{area.label}</h3>
                                    </div>
                                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/10 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full">
                                        <span className="text-white text-[11px] sm:text-xs font-semibold">{area.priceRange}</span>
                                    </div>
                                </div>
                                <div className="p-4 sm:p-5">
                                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">{area.description}</p>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                        {area.highlights.map((h) => (
                                            <span key={h} className="text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 bg-muted/60 rounded-full text-foreground border border-border/40">{h}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1.5 sm:gap-2">
                                            {area.types.map((t) => (
                                                <span key={t} className="text-[10px] sm:text-[11px] font-bold text-secondary uppercase tracking-wider">{t}</span>
                                            ))}
                                        </div>
                                        <span className="text-primary text-xs sm:text-sm font-semibold group-hover:text-secondary transition-colors flex items-center gap-1">
                                            View
                                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========= RESIDENTIAL ========= */}
            <ResidentialListingSection properties={residentialProperties} />

            {/* ========= WHY US ========= */}
            <section className="py-20 bg-background">
                <div className="section-container">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 mb-4">
                                <span className="w-8 h-[2px] bg-secondary" />
                                <span className="text-primary font-bold uppercase tracking-widest text-[13px]">Why Square21</span>
                            </div>
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6">
                                We Don&apos;t Just List Properties.
                                <br />
                                <span className="text-secondary">We Close Deals.</span>
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                Square21 Marketing is not a typical property portal. We are a hands-on brokerage that personally verifies every listing, negotiates on your behalf, and handles all legal documentation.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href="https://wa.me/923083333818" target="_blank" rel="noopener noreferrer">
                                    <Button className="bg-secondary text-white hover:bg-secondary/90 gap-2">
                                        <MessageCircle className="w-4 h-4" />
                                        WhatsApp Us
                                    </Button>
                                </a>
                                <a href="tel:+923083333818">
                                    <Button variant="outline" className="gap-2">
                                        <Phone className="w-4 h-4" />
                                        Call Now
                                    </Button>
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {whyUs.map((item, i) => (
                                <div key={i} className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-secondary/30 hover:shadow-lg transition-all duration-500">
                                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:scale-110 transition-all duration-500">
                                        <item.icon className="w-6 h-6 text-secondary group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-secondary transition-colors">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========= COMMERCIAL ========= */}
            <CommercialListingSection properties={commercialProperties} />

            {/* ========= RECENT DEALS ========= */}
            <section className="py-20 bg-primary">
                <div className="section-container">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 mb-3">
                            <span className="w-8 h-[2px] bg-secondary" />
                            <span className="text-secondary font-bold uppercase tracking-widest text-[13px]">Track Record</span>
                            <span className="w-8 h-[2px] bg-secondary" />
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground tracking-tight">
                            Recently Closed Deals
                        </h2>
                        <p className="text-primary-foreground/60 mt-3 max-w-xl mx-auto">
                            Real transactions. Real results. Here are some of our most recent closings.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {recentDeals.map((deal, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-secondary/30 transition-all duration-500 group">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${deal.type === 'Sold' ? 'bg-secondary/20 text-secondary' : 'bg-green-500/20 text-green-400'}`}>
                                        {deal.type}
                                    </span>
                                    <span className="text-primary-foreground/40 text-xs">{deal.sector}</span>
                                </div>
                                <h3 className="text-primary-foreground font-display text-lg font-semibold mb-1 group-hover:text-secondary transition-colors">{deal.title}</h3>
                                <p className="text-primary-foreground/50 text-sm mb-4">{deal.area}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <span className="text-secondary font-bold text-lg">{deal.price}</span>
                                    <span className="text-primary-foreground/40 text-xs flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {deal.timeline}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========= TESTIMONIALS ========= */}
            <TestimonialsSection />

            {/* ========= INLINE NEWSLETTER ========= */}
            <section className="py-20 bg-muted/30">
                <div className="section-container">
                    <div className="bg-card rounded-3xl border border-border/50 overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-0">
                            <div className="p-10 lg:p-14 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 mb-4">
                                    <span className="w-8 h-[2px] bg-secondary" />
                                    <span className="text-primary font-bold uppercase tracking-widest text-[13px]">Stay Updated</span>
                                </div>
                                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
                                    Get Market Insights
                                    <br />
                                    <span className="text-secondary">Delivered Weekly</span>
                                </h2>
                                <p className="text-muted-foreground mb-8 leading-relaxed">
                                    CDA sector updates, new listings, price trends, and investment opportunities — straight to your inbox. No spam, just value.
                                </p>
                                <NewsletterInlineForm />
                            </div>
                            <div className="hidden lg:flex bg-gradient-to-br from-primary to-primary/80 p-14 flex-col justify-center">
                                <div className="space-y-6">
                                    {[
                                        'New property listings before they go public',
                                        'Weekly Islamabad market price trends',
                                        'Investment opportunity alerts',
                                        'CDA sector development updates',
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                                            <span className="text-primary-foreground/90 text-sm font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function NewsletterInlineForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) return;
        setStatus('loading');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://square21marketing.com/api'}/subscribers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">You&apos;re subscribed! Check your inbox.</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-12 px-5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none transition-all"
            />
            <Button
                type="submit"
                disabled={status === 'loading'}
                className="h-12 px-8 bg-secondary text-white hover:bg-secondary/90 rounded-xl font-semibold"
            >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </Button>
        </form>
    );
}