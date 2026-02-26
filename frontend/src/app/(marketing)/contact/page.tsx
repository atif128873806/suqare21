'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import GoogleMap from '@/components/common/GoogleMap';

export default function ContactPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.createLead({
                name: formData.name,
                phone: formData.phone,
                email: formData.email || undefined,
                message: `Subject: ${formData.subject}\n\n${formData.message}`,
                source: 'WEBSITE_FORM',
            });

            toast({
                title: "Message Sent!",
                description: "Thank you for contacting us. We'll get back to you shortly.",
            });
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        { icon: Phone, title: 'Phone', value: '+92 308 3333818', href: 'tel:+923083333818' },
        { icon: MessageCircle, title: 'WhatsApp', value: '+92 308 3333818', href: 'https://wa.me/923083333818' },
        { icon: Mail, title: 'Email', value: 'info@square21.pk', href: 'mailto:info@square21.pk' },
        { icon: MapPin, title: 'Office', value: 'Office #21, Blue Area, Islamabad', href: '#' },
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
                <div className="bg-texture-grain" />
                {/* Subtle red gradient glow to tie into brand */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="section-container relative z-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-8 h-[2px] bg-secondary" />
                        <span className="text-secondary text-sm font-bold uppercase tracking-widest">Get in Touch</span>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4 tracking-tight">Contact Us</h1>
                    <p className="text-primary-foreground/80 max-w-2xl font-medium">
                        Have questions about a property or need expert advice? We&apos;re here to help you find the perfect solution.
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 bg-muted/30">
                <div className="section-container">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <a
                                key={index}
                                href={info.href}
                                target={info.href.startsWith('http') ? '_blank' : undefined}
                                rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-card-hover transition-all group"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                    <info.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                                </div>
                                <h3 className="font-semibold mb-1">{info.title}</h3>
                                <p className="text-muted-foreground text-sm">{info.value}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="py-20">
                <div className="section-container">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div>
                            <h2 className="font-display text-2xl font-bold mb-6">Send Us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Full Name *</label>
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                                        <Input
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+92 xxx xxxxxxx"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Subject *</label>
                                    <Select
                                        value={formData.subject}
                                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="rent">Property Rental Inquiry</SelectItem>
                                            <SelectItem value="lease">Commercial Leasing</SelectItem>
                                            <SelectItem value="sale">Property for Sale</SelectItem>
                                            <SelectItem value="valuation">Property Valuation</SelectItem>
                                            <SelectItem value="general">General Inquiry</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Message *</label>
                                    <Textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell us about your requirements..."
                                        rows={5}
                                    />
                                </div>

                                <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                                    <Send className="w-4 h-4 mr-2" />
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </div>

                        {/* Info */}
                        <div className="bg-card rounded-xl border border-border p-8">
                            <h2 className="font-display text-2xl font-bold mb-6">Visit Our Office</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Location</h3>
                                    <p className="text-muted-foreground">
                                        Office #21, Blue Area<br />
                                        Islamabad, Pakistan
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Business Hours</h3>
                                    <p className="text-muted-foreground">
                                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                                        Saturday: 10:00 AM - 4:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Quick Contact</h3>
                                    <div className="space-y-2">
                                        <p className="text-muted-foreground">
                                            <strong>Phone:</strong> <a href="tel:+923083333818" className="hover:text-primary">+92 308 3333818</a>
                                        </p>
                                        <p className="text-muted-foreground">
                                            <strong>Email:</strong> <a href="mailto:info@square21.pk" className="hover:text-primary">info@square21.pk</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-border">
                                    <p className="text-muted-foreground text-sm mb-4">
                                        Prefer instant communication? Reach us on WhatsApp for faster responses.
                                    </p>
                                    <a href="https://wa.me/923083333818" target="_blank" rel="noopener noreferrer">
                                        <Button variant="whatsapp" className="w-full">
                                            <MessageCircle className="w-5 h-5 mr-2" />
                                            Chat on WhatsApp
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="pb-20">
                <div className="section-container">
                    <div className="rounded-[2rem] overflow-hidden border border-border bg-card shadow-premium h-[450px]">
                        <GoogleMap
                            query="Office #21, Blue Area, Islamabad, Pakistan"
                            className="h-full rounded-none border-none"
                            zoom={16}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
