'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';
import { formatPrice } from '@/data/properties';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Ruler, Phone, MessageCircle, ArrowRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
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

  const getPurposeBadge = () => {
    const labels = {
      RENT: 'For Rent',
      LEASE: 'For Lease',
      SALE: 'For Sale',
    };
    return (
      <Badge variant="outline" className="bg-secondary/80 text-secondary-foreground border-0 text-xs uppercase tracking-wider">
        {labels[property.purpose]}
      </Badge>
    );
  };

  const getTypeBadge = () => {
    const colors = {
      INDUSTRIAL: 'bg-amber-500/90',
      COMMERCIAL: 'bg-blue-500/90',
      RESIDENTIAL: 'bg-emerald-500/90',
    };
    return (
      <Badge className={`${colors[property.type]} text-white border-0 text-xs uppercase tracking-wider`}>
        {property.type}
      </Badge>
    );
  };

  const getImageSrc = (image: string | { src: string; height: number; width: number; blurDataURL?: string }) => {
    return typeof image === 'string' ? image : image.src;
  };

  return (
    <div className="property-card group">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={getImageSrc(property.images[0])}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {getTypeBadge()}
          {getPurposeBadge()}
        </div>
        <div className="absolute top-4 right-4">
          {getStatusBadge()}
        </div>

        {/* Price */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-display text-2xl font-semibold">
            {formatPrice(property.price)}
            <span className="text-sm font-body font-normal text-white/80">
              {property.priceType === 'monthly' ? ' /month' : property.priceType === 'yearly' ? ' /year' : ''}
            </span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>
              {property.location.includes(' | ')
                ? `${property.location.split(' | ')[0]}, ${property.location.split(' | ')[1]}`
                : property.location}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="w-4 h-4" />
            <span>{property.area.toLocaleString()} {property.areaUnit}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {property.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
            >
              {feature}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
              +{property.features.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <Link href={`/property/${property.id}`} className="flex-1">
            <Button variant="outline" className="w-full group/btn">
              View Details
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
          <a href="tel:+923001234567">
            <Button variant="secondary" size="icon">
              <Phone className="w-4 h-4" />
            </Button>
          </a>
          <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="icon">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
