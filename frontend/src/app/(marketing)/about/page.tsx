'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Building2, Users, Award, TrendingUp, MessageCircle, CheckCircle } from 'lucide-react';

export default function AboutPage() {
    const values = [
        { icon: CheckCircle, title: 'Integrity', description: 'We uphold the highest standards of integrity in all our actions.' },
        { icon: Users, title: 'Client-Centric', description: 'Our clients\' needs are at the center of everything we do.' },
        { icon: Award, title: 'Excellence', description: 'We strive for excellence in service and results.' },
        { icon: TrendingUp, title: 'Innovation', description: 'We embrace innovation to better serve our clients.' },
    ];

    const team = [
        {
            name: 'Mudassar Ahmad Khan',
            role: 'CEO & Founder',
            // expertise: 'Commercial Properties',
            image: '/images/team/Founder.jpeg'
        },
        {
            name: 'Shahbaz Khalid',
            role: 'Senior Consultant',
            // expertise: 'Industrial Leasing',
            image: '/images/team/Consultant.jpeg'
        },
        {
            name: 'Junaid Khan Swati',
            role: 'Founder',
            // expertise: 'Residential Sales',
            image: '/images/team/Founderr.jpeg'
        },
        {
            name: 'Syed Waleed Ahsan',
            role: 'Senior Consultant',
            // expertise: 'Market Analysis',
            image: '/images/team/consultant.jpeg'
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="bg-secondary text-secondary-foreground py-20">
                <div className="section-container">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wider">Our Story</span>
                    <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">About Square21 Marketing</h1>
                    <p className="text-secondary-foreground/70 max-w-2xl">
                        Islamabad&apos;s trusted real estate agency with over 15 years of experience in industrial, commercial, and residential properties.
                    </p>
                </div>
            </section>

            {/* Team */}
            <section className="py-20">
                <div className="section-container">
                    <div className="text-center mb-12">
                        <span className="text-primary text-sm font-semibold uppercase tracking-wider">Meet Our Team</span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Expert Property Advisors</h2>
                        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                            Our team of dedicated professionals brings years of experience and local market knowledge to help you find the perfect property.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative w-48 h-64 mx-auto mb-4 overflow-hidden rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-md">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover object-top"
                                    />
                                </div>
                                <h3 className="font-display text-lg font-semibold">{member.name}</h3>
                                <p className="text-primary text-sm font-medium">{member.role}</p>
                                {/* <p className="text-muted-foreground text-sm mt-1">{member.expertise}</p> */}
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Mission & Vision */}
            <section className="py-20">
                <div className="section-container">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-card rounded-xl border border-border p-8">
                            <Building2 className="w-12 h-12 text-primary mb-4" />
                            <h2 className="font-display text-2xl font-bold mb-4">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To provide exceptional real estate services that help our clients make informed decisions and achieve their property goals. We are committed to delivering personalized solutions, transparent dealings, and lasting relationships built on trust and integrity.
                            </p>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-8">
                            <Award className="w-12 h-12 text-primary mb-4" />
                            <h2 className="font-display text-2xl font-bold mb-4">Our Vision</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To be the leading real estate agency in Islamabad, recognized for our expertise, ethical practices, and commitment to excellence. We envision a future where every client finds their perfect property match through our dedicated service and market knowledge.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 bg-muted/30">
                <div className="section-container">
                    <div className="text-center mb-12">
                        <span className="text-primary text-sm font-semibold uppercase tracking-wider">What Drives Us</span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Our Core Values</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div key={index} className="bg-card rounded-xl p-6 border border-border text-center">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <value.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-display text-lg font-semibold mb-2">{value.title}</h3>
                                <p className="text-muted-foreground text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            
            {/* CTA */}
            {/* <section className="py-20 bg-secondary text-secondary-foreground">
                <div className="section-container text-center">
                    <Building2 className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                        Ready to Work with Us?
                    </h2>
                    <p className="text-secondary-foreground/70 max-w-xl mx-auto mb-8">
                        Whether you&apos;re looking to buy, rent, or lease property in Islamabad, our team is ready to help.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/contact">
                            <Button variant="hero" size="xl">
                                Contact Us
                            </Button>
                        </Link>
                        <a href="https://wa.me/923083333818" target="_blank" rel="noopener noreferrer">
                            <Button variant="whatsapp" size="xl">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                WhatsApp
                            </Button>
                        </a>
                    </div>
                </div>
            </section> */}
        </div>
    );
}
