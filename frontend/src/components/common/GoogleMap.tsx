'use client';

import { cn } from "@/lib/utils";

interface GoogleMapProps {
    query: string;
    className?: string;
    zoom?: number;
    embedCode?: string;
}

const GoogleMap = ({ query, className = '', zoom = 14, embedCode }: GoogleMapProps) => {
    // If raw embed code is provided, use it but try to strip width/height to make it responsive
    if (embedCode) {
        // Simple way to make iframe responsive: set width-100% and height-100%
        let responsiveEmbed = embedCode
            .replace(/width="[^"]*"/, 'width="100%"')
            .replace(/height="[^"]*"/, 'height="100%"');

        return (
            <div
                className={`w-full h-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner ${className}`}
                dangerouslySetInnerHTML={{ __html: responsiveEmbed }}
            />
        );
    }

    const encodedQuery = encodeURIComponent(query);
    const mapUrl = `https://www.google.com/maps?q=${encodedQuery}&output=embed&z=${zoom}`;

    return (
        <div className={`w-full h-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner ${className}`}>
            <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                className="border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    );
};

export default GoogleMap;
