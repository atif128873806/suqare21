'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send, Bell, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const hasSubscribed = sessionStorage.getItem('square21_subscribed');
        const hasClosed = sessionStorage.getItem('square21_newsletter_closed');

        if (!hasSubscribed && !hasClosed) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem('square21_newsletter_closed', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) return;

        setIsSubmitting(true);
        try {
            await api.subscribe(email);
            setIsSuccess(true);
            sessionStorage.setItem('square21_subscribed', 'true');
            toast({
                title: "Welcome to our Inner Circle",
                description: "You're now subscribed to Square21's premium market insights.",
            });
            setTimeout(() => setIsOpen(false), 3000);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Subscription Failed",
                description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-[600px] bg-[#EEF2FF] rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-black/40 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="px-5 py-8 md:p-12 text-center">
                            {isSuccess ? (
                                <div className="py-8 md:py-12 animate-in zoom-in-95 duration-500">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4 md:mb-6">
                                        <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-black mb-2 md:mb-3 italic">THANK YOU!</h3>
                                    <p className="text-black/60 font-bold uppercase tracking-widest text-[10px] md:text-sm">
                                        You're now part of the Square21 inner circle.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-[22px] md:text-5xl font-black text-black leading-[1.1] mb-4 md:mb-6 tracking-tight">
                                        JOIN OUR NEWSLETTER <br className="hidden md:block" />
                                        AND STAY UP TO DATE
                                    </h2>

                                    <p className="text-black/60 font-medium leading-relaxed mb-6 md:mb-10 max-w-[95%] md:max-w-[80%] mx-auto text-[13px] md:text-base">
                                        Get exclusive property insights, CDA sector updates, and premium investment opportunities in Islamabad directly to your inbox.
                                    </p>

                                    <form onSubmit={handleSubmit} className="mb-4 md:mb-8">
                                        <div className="flex flex-col md:flex-row items-stretch bg-white border-[3px] border-black rounded-lg md:rounded-lg overflow-hidden group focus-within:ring-4 ring-primary/10 transition-all">
                                            <input
                                                type="email"
                                                placeholder="Enter Your Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="flex-1 h-14 md:h-16 px-6 md:px-8 bg-transparent outline-none text-black font-semibold placeholder:text-black/40 placeholder:font-bold text-base md:text-lg py-3"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="h-14 md:h-16 px-8 bg-[#d91435] hover:bg-[#b0102b] text-white font-black text-lg transition-colors disabled:opacity-70 border-t-[3px] md:border-t-0 md:border-l-[3px] border-black"
                                            >
                                                {isSubmitting ? "..." : "Subscribe"}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
