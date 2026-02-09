import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold tracking-tighter">
                        SQUARE<span className="text-red-600">21</span>
                    </span>
                </Link>
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    <Link href="/rent" className="hover:text-red-600 transition-colors">Rentals</Link>
                    <Link href="/sale" className="hover:text-red-600 transition-colors">Sales</Link>
                    <Link href="/valuation" className="hover:text-red-600 transition-colors">Valuation</Link>
                    <Link href="/about" className="hover:text-red-600 transition-colors">About</Link>
                    <Link href="/contact" className="px-5 py-2.5 bg-black text-white rounded-full hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200">
                        Contact Us
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export const Footer = () => {
    return (
        <footer className="bg-zinc-950 text-white py-16">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <span className="text-2xl font-bold tracking-tighter">
                        SQUARE<span className="text-red-600">21</span>
                    </span>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Leading real estate agency in Islamabad. Industrial, Commercial, and Residential property specialists.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-6">Services</h4>
                    <ul className="space-y-3 text-zinc-400 text-sm">
                        <li><Link href="/rent">Industrial Rentals</Link></li>
                        <li><Link href="/rent">Commercial Leasing</Link></li>
                        <li><Link href="/sale">CDA Commercial Sales</Link></li>
                        <li><Link href="/valuation">Property Valuation</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6">Company</h4>
                    <ul className="space-y-3 text-zinc-400 text-sm">
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/careers">Careers</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6">Address</h4>
                    <p className="text-zinc-400 text-sm">
                        Blue Area, Islamabad<br />
                        Pakistan
                    </p>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-16 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
                &copy; {new Date().getFullYear()} Square21 Marketing. All rights reserved.
            </div>
        </footer>
    );
};
