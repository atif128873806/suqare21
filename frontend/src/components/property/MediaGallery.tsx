'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface MediaGalleryProps {
    images: (string | { src: string; height: number; width: number; blurDataURL?: string })[];
    videos?: string[];
    title: string;
}

const MediaGallery = ({ images, videos = [], title }: MediaGalleryProps) => {
    // Combine media items for unified navigation
    const mediaItems = [
        ...images.map(img => ({ type: 'image' as const, src: typeof img === 'string' ? img : img.src })),
        ...videos.map(vid => ({ type: 'video' as const, src: vid }))
    ];

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const currentMedia = mediaItems[selectedIndex];
    const isVideo = currentMedia?.type === 'video';

    const nextMedia = () => {
        setSelectedIndex((prev) => (prev + 1) % mediaItems.length);
    };

    const prevMedia = () => {
        setSelectedIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    };

    const openLightbox = (index: number) => {
        setSelectedIndex(index);
        setIsLightboxOpen(true);
    };

    if (mediaItems.length === 0) return null;

    return (
        <>
            {/* Main Media Display + Thumbnails */}
            <div className="space-y-4">
                {/* Main Media */}
                <div className="relative h-[50vh] md:h-[60vh] rounded-xl overflow-hidden group cursor-pointer bg-black"
                    onClick={() => openLightbox(selectedIndex)}>
                    {isVideo ? (
                        <video
                            src={currentMedia.src}
                            className="w-full h-full object-contain"
                            controls
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <img
                            src={currentMedia.src}
                            alt={`${title} - Image ${selectedIndex + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Media Counter */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm font-medium">
                        {selectedIndex + 1} / {mediaItems.length}
                    </div>

                    {/* Navigation Arrows */}
                    {mediaItems.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Click hint for images */}
                    {!isVideo && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to view full size
                        </div>
                    )}
                </div>

                {/* Thumbnail Grid */}
                {mediaItems.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-4">
                        {mediaItems.map((media, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedIndex(index)}
                                className={`relative aspect-square rounded-lg overflow-hidden group cursor-pointer transition-all ${selectedIndex === index
                                    ? 'ring-2 ring-primary ring-offset-2'
                                    : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-2'
                                    }`}
                            >
                                {media.type === 'video' ? (
                                    <>
                                        <video
                                            src={media.src}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <Play className="w-8 h-8 text-white fill-white" />
                                        </div>
                                    </>
                                ) : (
                                    <img
                                        src={media.src}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                )}
                                {selectedIndex !== index && (
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setIsLightboxOpen(false)}>
                    {/* Close Button */}
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Media Counter */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium z-10">
                        {selectedIndex + 1} / {mediaItems.length}
                    </div>

                    {/* Main Media */}
                    <div className="relative max-w-7xl max-h-[90vh] w-full"
                        onClick={(e) => e.stopPropagation()}>
                        {isVideo ? (
                            <video
                                src={currentMedia.src}
                                controls
                                autoPlay
                                className="w-full h-full max-h-[90vh] rounded-lg"
                            />
                        ) : (
                            <img
                                src={currentMedia.src}
                                alt={`${title} - Media ${selectedIndex + 1}`}
                                className="w-full h-full object-contain rounded-lg"
                            />
                        )}
                    </div>

                    {/* Navigation Arrows */}
                    {mediaItems.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    {/* Thumbnail Strip */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-6xl w-full px-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                            {mediaItems.map((media, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${selectedIndex === index
                                        ? 'ring-2 ring-white scale-110'
                                        : 'hover:ring-2 hover:ring-white/50 opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    {media.type === 'video' ? (
                                        <>
                                            <video src={media.src} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <Play className="w-6 h-6 text-white fill-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <img
                                            src={media.src}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MediaGallery;
