'use client';
import { useState, useRef } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';
import { formatPrice } from '@/data/properties';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Ruler, Building, ArrowRight } from 'lucide-react';
import styles from './PropertyCard.module.css';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log("Video play failed:", err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      // Optionally reset to start
      videoRef.current.currentTime = 0;
    }
  };
  const getStatusBadge = () => {
    switch (property.status) {
      case 'AVAILABLE':
        return <Badge className="bg-success text-success-foreground hover:bg-success border-0 px-3 py-1 text-xs uppercase tracking-wider font-bold">Available</Badge>;
      case 'RENTED':
        return <Badge className="bg-muted text-muted-foreground border-border px-3 py-1 text-xs uppercase tracking-wider font-bold">Rented</Badge>;
      case 'SOLD':
        return <Badge className="bg-secondary text-secondary-foreground border-0 px-3 py-1 text-xs uppercase tracking-wider font-bold">Sold</Badge>;
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
      <Badge variant="outline" className="bg-black/40 backdrop-blur-md text-white border-white/20 text-[10px] font-bold uppercase tracking-wider shadow-sm px-2.5 py-1">
        {labels[property.purpose]}
      </Badge>
    );
  };

  const getTypeBadge = () => {
    const colors = {
      INDUSTRIAL: 'bg-secondary text-secondary-foreground', // Red
      COMMERCIAL: 'bg-primary text-primary-foreground', // Navy/Black
      RESIDENTIAL: 'bg-slate-700 text-white', // Dark Slate
    };
    return (
      <Badge className={`${colors[property.type]} border-0 text-[10px] font-bold uppercase tracking-wider shadow-sm px-2.5 py-1`}>
        {property.type}
      </Badge>
    );
  };

  const getImageSrc = (image: string | { src: string; height: number; width: number; blurDataURL?: string } | undefined | null) => {
    if (!image) return '/placeholder.svg';
    return typeof image === 'string' ? image : image.src;
  };

  return (
    <div
      className={`${styles.propertyCard} group flex flex-col h-full bg-card rounded-2xl border border-border/60 overflow-hidden transition-all duration-500 p-4 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-primary/20`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted flex-shrink-0 rounded-[14px] mb-5">
        {property.videos && property.videos.length > 0 && (!property.images || property.images.length === 0 || property.images[0] === '/assets/property-residential.jpg') ? (
          <video
            ref={videoRef}
            src={property.videos[0]}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            muted
            loop
            playsInline
            preload="none"
            poster={getImageSrc(property.images?.[0])}
          />
        ) : (
          <Image
            src={getImageSrc(property.images?.[0])}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 transition-opacity duration-500" />

        {/* Badges on Image */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          {getTypeBadge()}
          {getPurposeBadge()}
        </div>
        <div className="absolute top-4 right-4 z-10">
          {getStatusBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow relative px-1">
        <h3 className="font-display text-[22px] font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {property.title}
        </h3>

        <div className="text-muted-foreground text-[15px] font-body mb-6 min-h-[4.5rem] leading-relaxed">
          {property.description.length > 110
            ? `${property.description.substring(0, 110).trim()}... `
            : `${property.description} `}
          <Link href={`/property/${property.id}`} className="inline-flex" aria-label={`Read more about ${property.title}`}>
            <span className="text-primary underline underline-offset-4 hover:text-secondary font-medium transition-colors cursor-pointer inline-block whitespace-nowrap">
              Read More
              <span className="sr-only"> about {property.title}</span>
            </span>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          {property.area > 0 && (
            <div className="flex items-center gap-2.5 px-3.5 py-2 bg-muted/50 rounded-full border border-border/50 shadow-sm">
              <Ruler className="w-[15px] h-[15px] text-muted-foreground" />
              <span className="text-foreground text-[13px] font-medium tracking-wide">{property.area.toLocaleString()} {property.areaUnit}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-muted/50 rounded-full border border-border/50 shadow-sm">
            <MapPin className="w-[15px] h-[15px] text-muted-foreground" />
            <span className="text-foreground text-[13px] font-medium tracking-wide">
              {property.location.includes(' | ')
                ? property.location.split(' | ')[0]
                : property.location}
            </span>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-muted/50 rounded-full border border-border/50 shadow-sm">
            <Building className="w-[15px] h-[15px] text-muted-foreground" />
            <span className="text-foreground text-[13px] font-medium tracking-wide capitalize">{property.type.toLowerCase()}</span>
          </div>
        </div>

        {/* Actions Bottom Row */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40 gap-4">
          {/* Price */}
          <div className="flex flex-col flex-shrink-0 min-w-[110px]">
            <span className="text-muted-foreground text-[13px] font-semibold mb-1">Price</span>
            <span className="text-foreground font-body text-[22px] font-bold tracking-tight">
              {property.price > 0 ? (
                formatPrice(property.price)
              ) : (
                <span className="text-lg text-primary">Available</span>
              )}
            </span>
          </div>

          {/* CTA Button */}
          <Link href={`/property/${property.id}`} className="flex-grow w-full">
            <Button className="w-full bg-secondary text-white hover:bg-secondary/90 hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all font-medium rounded-[10px] py-[22px] text-[14px] tracking-wide border-0 active:scale-[0.98]">
              View Property Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
