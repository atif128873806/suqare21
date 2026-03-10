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
        // Show after 5 seconds if not subscribed
        const hasSubscribed = localStorage.getItem('square21_subscribed');
        const hasClosed = localStorage.getItem('square21_newsletter_closed');

        if (!hasSubscribed && !hasClosed) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('square21_newsletter_closed', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) return;

        setIsSubmitting(true);
        try {
            await api.subscribe(email);
            setIsSuccess(true);
            localStorage.setItem('square21_subscribed', 'true');
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
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-[500px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
                    >
                        {/* Elite Accent Bar */}
                        <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary" />

                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-primary/40 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-10 lg:p-12">
                            {isSuccess ? (
                                <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                                    <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-600 mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-3xl font-display font-bold text-primary mb-3">Welcome Aboard</h3>
                                    <p className="text-muted-foreground font-medium leading-relaxed">
                                        Your access to exclusive property intelligence has been activated.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                            <Bell className="w-6 h-6" />
                                        </div>
                                        <div className="h-px flex-1 bg-border/40" />
                                    </div>

                                    <h2 className="text-3xl font-display font-bold text-primary tracking-tight leading-tight mb-4">
                                        Get the Islamabad <br />
                                        <span className="text-secondary italic">Market Edge</span>
                                    </h2>

                                    <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8">
                                        Join our elite registry to receive high-priority property alerts,
                                        CDA sector insights, and off-market investment opportunities.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="email"
                                                placeholder="Your professional email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="h-14 pl-12 rounded-2xl border-border/60 bg-slate-50/30 focus:bg-white transition-all font-medium text-base"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[10px] gap-3 shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <><Send className="w-4 h-4" /> Secure Your Access</>
                                            )}
                                        </Button>
                                    </form>

                                    <p className="mt-6 text-[10px] text-center text-muted-foreground font-bold uppercase tracking-[0.1em] opacity-40">
                                        No Spam · Secure · Exclusive Only
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
