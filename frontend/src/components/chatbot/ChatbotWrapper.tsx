'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MessageCircle, X } from 'lucide-react';

const Chatbot = dynamic(() => import('./Chatbot'), {
    ssr: false,
});

export default function ChatbotWrapper() {
    const [shouldLoad, setShouldLoad] = useState(false);
    const [showTeaser, setShowTeaser] = useState(false);

    useEffect(() => {
        // Only show teaser/allow loading after 10s to satisfy PageSpeed "Unused JS"
        const timer = setTimeout(() => {
            setShowTeaser(true);
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    const handleOpen = () => {
        setShouldLoad(true);
        setShowTeaser(false);
    };

    if (shouldLoad) {
        return <Chatbot />;
    }

    return (
        <>
            {/* Teaser Bubble (Static Placeholder) */}
            {showTeaser && (
                <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
                    <div
                        onClick={handleOpen}
                        className="bg-white text-primary px-4 py-3 rounded-2xl rounded-br-sm shadow-xl border border-secondary/20 flex items-center gap-3 relative max-w-[220px] cursor-pointer hover:scale-105 transition-transform"
                    >
                        <div className="relative shrink-0">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full absolute -top-0.5 -right-0.5 animate-pulse ring-2 ring-white" />
                            <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-secondary" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold mb-0.5">Square21 Assistant</p>
                            <p className="text-[10px] text-muted-foreground leading-tight">Hi there! 👋 Need help finding your dream property?</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowTeaser(false); }}
                            className="absolute -top-2 -left-2 bg-background border border-border text-muted-foreground rounded-full p-1 hover:bg-destructive hover:text-white transition-colors shadow-sm"
                            aria-label="Close teaser"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}

            {/* Static Chat Button (Trigger) */}
            <button
                onClick={handleOpen}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-secondary text-secondary-foreground rounded-full p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-110 active:scale-95 transition-all duration-300 animate-in fade-in zoom-in group border-2 border-white/20"
                aria-label="Open chat"
            >
                <div className="relative">
                    <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-secondary"></span>
                    </span>
                </div>
            </button>
        </>
    );
}
