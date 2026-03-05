'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        rating: 5,
        title: 'Smooth & Stress-Free Process',
        text: 'I had a very pleasant experience with Square 21 Marketing throughout the process of purchasing my house. The team was professional, transparent, and highly supportive at every stage. CDA-related procedures were handled smoothly and efficiently.',
        name: 'Adnan Salam',
        location: 'Islamabad',
        avatar: 'AS',
    },
    {
        id: 2,
        rating: 5,
        title: 'Honest & Trustworthy Dealer',
        text: 'Square21 Marketing is an excellent and trustworthy property dealer. They helped me find a house at a very good price and guided me honestly throughout the entire process. Their team is dedicated, professional, and truly honest in their work.',
        name: 'Shamsullah Kakar',
        location: 'Islamabad',
        avatar: 'SK',
    },
    {
        id: 3,
        rating: 5,
        title: 'Blown Away by Professionalism',
        text: 'I recently rented a new space from Square21 Marketing, and I\'m blown away by their professionalism. From start to finish, everything was spotless — documentation was crystal clear, the transaction was smooth, and the setup was done perfectly.',
        name: 'Mahaz Jahangir',
        location: 'Islamabad',
        avatar: 'MJ',
    },
    {
        id: 4,
        rating: 5,
        title: 'Excellent Warehouse Lease',
        text: 'I have leased a warehouse in I-9 with the help of Square 21 Marketing. I really enjoyed working with them — they are very honest and nice people. I highly recommend them for reliable property leasing services.',
        name: 'Rehan Nadeem',
        location: 'Islamabad, I-9',
        avatar: 'RN',
    },
    {
        id: 5,
        rating: 5,
        title: 'Trusted Name in Real Estate',
        text: 'I am very satisfied with the services of Square21 Marketing. The staff is professional, polite, and always available to answer questions. They value their clients and deliver what they promise. Definitely a trusted name in real estate marketing.',
        name: 'Inam Nomi',
        location: 'Islamabad',
        avatar: 'IN',
    },
    {
        id: 6,
        rating: 5,
        title: '4 Years — Zero Issues',
        text: 'I rented a 1,000 sq ft office in I-10 Islamabad Markaz through Square 21. It has been four years now, and I have not faced any issues during this period. They charged commission only once, and have been providing continuous, professional service since.',
        name: 'MazticPk',
        location: 'Islamabad, I-10',
        avatar: 'MP',
    },
    {
        id: 7,
        rating: 5,
        title: 'Great Experience as Overseas Buyer',
        text: 'I had a best experience with Square21 Marketing. I purchased a house as I am overseas, and it is difficult to find a reliable person in Islamabad, but after dealing with this team I am totally satisfied. Highly appreciated and recommended.',
        name: 'Ahmed Yar',
        location: 'Overseas (Islamabad)',
        avatar: 'AY',
    },
    {
        id: 8,
        rating: 5,
        title: 'Found Perfect Office for My Software House',
        text: 'Square21 Marketing helped me find a beautiful and perfectly located office space for my software house. Their team was professional, responsive, and truly understood what I was looking for. I highly recommend them to anyone searching for commercial space.',
        name: 'Zain Khan',
        location: 'Islamabad',
        avatar: 'ZK',
    },
    {
        id: 9,
        rating: 5,
        title: 'Excellent Service Throughout',
        text: 'I had a fantastic experience with Square21 Marketing when buying a house in I-10/2, Islamabad. The team was professional, transparent, and responsive throughout the entire process. I truly appreciate their guidance and highly recommend them.',
        name: 'Kamran Majeed',
        location: 'Islamabad, I-10/2',
        avatar: 'KM',
    },
    {
        id: 10,
        rating: 5,
        title: 'Smooth & Transparent Property Deal',
        text: 'I had an excellent experience with Square 21 Marketing. They helped me find the right property in Islamabad and ensured a smooth and transparent process. Their team handled all documentation safely and professionally.',
        name: 'Jalal Amjad',
        location: 'Islamabad',
        avatar: 'JA',
    },
    {
        id: 11,
        rating: 5,
        title: 'Professional & Stress-Free Home Purchase',
        text: 'I recently purchased my home through Square 21 Marketing, and I am truly impressed with their professionalism. The entire process was smooth, transparent, and stress-free. Their team guided me at every step and ensured all documentation was handled properly.',
        name: 'Saif Ali Khaan',
        location: 'Islamabad',
        avatar: 'SA',
    },
    {
        id: 12,
        rating: 5,
        title: 'Outstanding Service',
        text: 'Excellent service and a professional team which take care of your needs regarding house sale, rent, and renovation. Highly recommend Square 21 team. Thank you for outstanding services.',
        name: 'M Wasim G',
        location: 'Islamabad',
        avatar: 'MW',
    },
    {
        id: 13,
        rating: 5,
        title: 'Hassle-Free Apartment Purchase',
        text: 'I had a great experience purchasing a third-floor apartment in 18 West Residencia. The whole process was hassle-free, and the guidelines were straightforward. Highly recommended!',
        name: 'Aqsa Khan',
        location: 'Islamabad, 18 West Residencia',
        avatar: 'AK',
    },
    {
        id: 14,
        rating: 5,
        title: 'The Name of Trust',
        text: 'It\'s an amazing experience with Square 21 — the name of trust. Bought a house through Square 21 and fully satisfied. Highly recommended to anyone looking for a reliable real estate agency in Islamabad.',
        name: 'Baloch V Loger',
        location: 'Islamabad',
        avatar: 'BL',
    },
];

const CARDS_PER_PAGE = 3;

export default function TestimonialsSection() {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(testimonials.length / CARDS_PER_PAGE);

    const visible = testimonials.slice(
        page * CARDS_PER_PAGE,
        page * CARDS_PER_PAGE + CARDS_PER_PAGE
    );

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

            <div className="section-container">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-3">
                            <span className="w-8 h-[2px] bg-secondary" />
                            <span className="text-primary font-bold uppercase tracking-widest text-[13px]">Client Reviews</span>
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
                            What Our Clients Say
                        </h2>
                        <p className="mt-3 text-muted-foreground max-w-lg text-base leading-relaxed">
                            Real stories from property buyers, sellers, and investors who trusted Square21 Marketing with their real estate decisions.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-muted-foreground text-sm font-medium">
                            <span className="text-foreground font-bold">{page + 1}</span> of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="w-12 h-12 rounded-full border border-border/60 flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border/60 disabled:hover:text-foreground"
                            aria-label="Previous testimonials"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 hover:shadow-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Next testimonials"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-border/40 mb-10" />

                {/* Cards Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {visible.map((t) => (
                        <div
                            key={t.id}
                            className="group bg-muted/40 rounded-2xl p-7 flex flex-col gap-5 border border-border/60 hover:border-secondary/30 hover:bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                        >
                            {/* Stars */}
                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                                ))}
                            </div>

                            {/* Content */}
                            <div className="flex-grow">
                                <h3 className="font-display text-[20px] font-bold text-foreground mb-3">{t.title}</h3>
                                <p className="text-muted-foreground text-[15px] leading-relaxed font-body">{t.text}</p>
                            </div>

                            {/* Reviewer */}
                            <div className="flex items-center gap-4 mt-2 pt-5 border-t border-border/50">
                                {/* Avatar initials */}
                                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-[13px] tracking-wide">{t.avatar}</span>
                                </div>
                                <div>
                                    <p className="text-foreground font-semibold text-[15px] leading-tight">{t.name}</p>
                                    <p className="text-muted-foreground text-[13px] mt-0.5">{t.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
        </section>
    );
}
