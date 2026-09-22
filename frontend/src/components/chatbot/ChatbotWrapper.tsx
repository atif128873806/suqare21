'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MessageCircle, X } from 'lucide-react';

const Chatbot = dynamic(() => import('./Chatbot'), {
  ssr: false,
});

export default function ChatbotWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('chatbot_teaser_dismissed');
      if (!dismissed) setShowTeaser(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for close event from Chatbot component
  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    window.addEventListener('chatbot-close', handleClose);
    return () => window.removeEventListener('chatbot-close', handleClose);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowTeaser(false);
    sessionStorage.setItem('chatbot_teaser_dismissed', 'true');
  };

  const dismissTeaser = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTeaser(false);
    sessionStorage.setItem('chatbot_teaser_dismissed', 'true');
  };

  if (isOpen) {
    return <Chatbot />;
  }

  return (
    <>
      {/* Teaser Popup */}
      {showTeaser && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 animate-in slide-in-from-bottom-3 fade-in duration-500">
          <div
            onClick={handleOpen}
            className="bg-white dark:bg-card text-foreground px-4 py-3 rounded-2xl rounded-br-sm shadow-xl border border-border flex items-center gap-3 max-w-[240px] cursor-pointer hover:shadow-2xl transition-shadow"
          >
            <div className="relative shrink-0">
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse ring-2 ring-white dark:ring-card" />
              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold">Square21 Consultant</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                Need help finding your ideal property?
              </p>
            </div>
            <button
              onClick={dismissTeaser}
              className="absolute -top-2 -left-2 bg-background border border-border text-muted-foreground rounded-full p-0.5 hover:bg-destructive hover:text-white transition-colors shadow-sm"
              aria-label="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Chat Trigger Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-primary text-primary-foreground rounded-full p-3.5 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group border-2 border-white/20"
        aria-label="Chat with us"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
          <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white" />
          </span>
        </div>
      </button>
    </>
  );
}
