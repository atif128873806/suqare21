'use client';

import Link from 'next/link';
import { formatPrice } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MediaGallery from '@/components/property/MediaGallery';
import GoogleMap from '@/components/common/GoogleMap';
import { Property } from '@/types/property';
import { Phone, MessageCircle, MapPin, Ruler, Calendar, ArrowLeft, Share2, Heart, CheckCircle } from 'lucide-react';

interface PropertyDetailClientProps {
    property: Property;
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
    const getStatusBadge = () => {
        switch (property.status) {
            case 'AVAILABLE':
                return <Badge className="badge-premium badge-available">Available</Badge>;
            case 'RENTED':
                return <Badge className="badge-premium badge-rented">Rented</Badge>;
            case 'SOLD':
                return <Badge className="badge-premium badge-sold">Sold</Badge>;
            default:
                return null;
        }
    };

    const getLocationString = () => {
        const loc = property.location;
        if (loc.includes(' | ')) {
            const parts = loc.split(' | ');
            return parts[2] || parts[0]; // Prefer address, fallback to sector
        }
        return loc;
    };

    const getLocationSector = () => {
        const loc = property.location;
        if (loc.includes(' | ')) {
            return loc.split(' | ')[0];
        }
        return loc;
    };

    const getLocationCity = () => {
        const loc = property.location;
        if (loc.includes(' | ')) {
            return loc.split(' | ')[1] || 'Islamabad';
        }
        return 'Islamabad';
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Breadcrumb */}
            <div className="bg-card border-b border-border">
                <div className="section-container py-4">
                    <Link href="/properties" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Properties
                    </Link>
                </div>
            </div>

            {/* Image Gallery & Info Card */}
            <section className="relative pb-6">
                <div className="section-container py-6">
                    <MediaGallery images={property.images} videos={property.videos} title={property.title} />
                </div>

                <div className="section-container relative z-10">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className={`${property.type === 'INDUSTRIAL' ? 'bg-secondary text-secondary-foreground' : property.type === 'COMMERCIAL' ? 'bg-primary text-primary-foreground' : 'bg-slate-700 text-white'} border-0 text-[10px] font-bold uppercase tracking-wider shadow-sm px-2.5 py-1`}>
                                {property.type}
                            </Badge>
                            <Badge variant="outline" className="text-primary border-primary/20 text-[10px] font-bold uppercase tracking-wider shadow-sm px-2.5 py-1">
                                For {property.purpose}
                            </Badge>
                            {getStatusBadge()}
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                            {property.title}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-5 h-5" />
                            <span>{getLocationString()}</span>
                        </div>
                    </div>
                </div>

                <div className="absolute top-10 right-6 z-20 flex gap-2">
                    <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="section-container">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-card rounded-xl border border-border p-6">
                                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
                                    <div>
                                        <p className="text-muted-foreground text-sm mb-1 uppercase tracking-widest font-semibold">Listing Price</p>
                                        <p className="font-body text-3xl font-extrabold text-foreground tracking-tight">
                                            {property.price > 0 ? (
                                                <>
                                                    {formatPrice(property.price)}
                                                    <span className="text-lg font-medium text-muted-foreground ml-1">
                                                        {property.priceType === 'monthly' ? '/month' : property.priceType === 'yearly' ? '/year' : property.priceType === 'per_sqft' ? '/sqft' : ''}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-2xl text-secondary">Rental Spaces Available</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex gap-6">
                                        {property.area > 0 && (
                                            <div className="text-center">
                                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                    <Ruler className="w-4 h-4" />
                                                    <span className="text-sm">Area</span>
                                                </div>
                                                <p className="font-semibold">{property.area.toLocaleString()} {property.areaUnit}</p>
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">Location</span>
                                            </div>
                                            <p className="font-semibold">{getLocationSector()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-6">
                                    <div>
                                        <p className="text-muted-foreground text-sm">Type</p>
                                        <p className="font-semibold capitalize">{property.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm">Purpose</p>
                                        <p className="font-semibold capitalize">For {property.purpose}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm">Status</p>
                                        <p className="font-semibold capitalize">{property.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card rounded-xl border border-border p-6">
                                <h2 className="font-display text-xl font-semibold mb-4">Description</h2>
                                <div
                                    className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground"
                                    dangerouslySetInnerHTML={{ __html: property.description }}
                                />
                            </div>

                            <div className="bg-card rounded-xl border border-border p-6">
                                <h2 className="font-display text-xl font-semibold mb-4">Features & Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {property.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-secondary" />
                                            <span className="text-muted-foreground font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-card rounded-xl border border-border p-6">
                                <h2 className="font-display text-xl font-semibold mb-4">Location</h2>
                                <div className="aspect-video">
                                    <GoogleMap
                                        query={`${getLocationString()}, ${getLocationCity()}`}
                                        embedCode={property.mapHtml}
                                        className="h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-card rounded-xl border border-border p-6 sticky top-28">
                                <h3 className="font-display text-xl font-semibold mb-4">Interested?</h3>
                                <p className="text-muted-foreground text-sm mb-6">Contact our team for details.</p>

                                <div className="space-y-3">
                                    <a href="tel:+923083333818" className="block">
                                        <Button variant="default" size="lg" className="w-full">
                                            <Phone className="w-5 h-5 mr-2" /> Call Now
                                        </Button>
                                    </a>
                                    <a href="https://wa.me/923083333818" target="_blank" rel="noopener noreferrer" className="block">
                                        <Button variant="whatsapp" size="lg" className="w-full">
                                            <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                                        </Button>
                                    </a>
                                </div>

                                <div className="mt-6 pt-6 border-t border-border flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold italic">S</div>
                                    <div>
                                        <p className="font-semibold text-sm">Square21 Marketing</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            <span>Listed on {new Date(property.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
