'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Mock Data - ideally this comes from a CMS or API
const galleryImages = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1600596542815-27b88e36e29f?q=80&w=800&auto=format&fit=crop',
        category: 'Interior',
        title: 'Modern Living Room',
        size: 'large' // Spans 2 cols, 2 rows
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
        category: 'Exterior',
        title: 'Luxury Villa Facade',
        size: 'tall' // Spans 1 col, 2 rows
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
        category: 'Interior',
        title: 'Minimalist Kitchen',
        size: 'small'
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=800&auto=format&fit=crop',
        category: 'Interior',
        title: 'Master Bedroom',
        size: 'small'
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop',
        category: 'Exterior',
        title: 'Poolside Lounge',
        size: 'wide' // Spans 2 cols
    },
    {
        id: 6,
        src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
        category: 'Detail',
        title: 'Architectural details',
        size: 'small'
    },
];

export default function GallerySection() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selectedImage = galleryImages.find((img) => img.id === selectedId);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedId === null) return;
        const currentIndex = galleryImages.findIndex(img => img.id === selectedId);
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        setSelectedId(galleryImages[nextIndex].id);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedId === null) return;
        const currentIndex = galleryImages.findIndex(img => img.id === selectedId);
        const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        setSelectedId(galleryImages[prevIndex].id);
    };

    return (
        <section className="py-20 bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm">Our Portfolio</span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
                        Curated Excellence
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore a selection of our finest properties and architectural masterpieces.
                    </p>
                </div>

                {/* Bento Grid Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4">
                    {galleryImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            layoutId={`card-${image.id}`}
                            onClick={() => setSelectedId(image.id)}
                            className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-muted
                ${image.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                ${image.size === 'tall' ? 'md:col-span-1 md:row-span-2' : ''}
                ${image.size === 'wide' ? 'md:col-span-2 md:row-span-1' : ''}
                ${image.size === 'small' ? 'md:col-span-1 md:row-span-1' : ''}
              `}
                        >
                            <Image
                                src={image.src}
                                alt={image.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <p className="text-secondary text-xs uppercase tracking-wider font-semibold mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                    {image.category}
                                </p>
                                <h3 className="text-white font-display text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {image.title}
                                </h3>
                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                                    <ZoomIn className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {selectedId && selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
                        onClick={() => setSelectedId(null)}
                    >
                        <button
                            onClick={() => setSelectedId(null)}
                            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors z-50 p-2"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Navigation */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 p-2 hover:bg-white/10 rounded-full"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 p-2 hover:bg-white/10 rounded-full"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        <motion.div
                            layoutId={`card-${selectedImage.id}`}
                            className="relative max-w-5xl w-full max-h-[85vh] rounded-xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-[85vh]">
                                <Image
                                    src={selectedImage.src}
                                    alt={selectedImage.title}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                    priority
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                <p className="text-secondary font-bold text-sm uppercase tracking-widest mb-1">{selectedImage.category}</p>
                                <h3 className="text-white font-display text-3xl font-bold">{selectedImage.title}</h3>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
