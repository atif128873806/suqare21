"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Linkedin, Send, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

const FooterNewsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setStatus('LOADING');
    try {
      await api.subscribe(email);
      setStatus('SUCCESS');
      setEmail('');
    } catch {
      setStatus('ERROR');
    }
  };

  if (status === 'SUCCESS') {
    return (
      <div className="flex items-center gap-2 text-secondary text-xs font-bold animate-in fade-in slide-in-from-left-2">
        <CheckCircle2 className="w-4 h-4" /> SUBSCRIBED
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className="relative group">
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg h-10 pl-4 pr-10 text-xs focus:outline-none focus:border-secondary transition-all"
        required
      />
      <button
        type="submit"
        disabled={status === 'LOADING'}
        className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-primary-foreground/40 hover:text-secondary transition-colors"
        aria-label="Subscribe"
      >
        {status === 'LOADING' ? (
          <div className="w-3 h-3 border border-secondary/20 border-t-secondary rounded-full animate-spin" />
        ) : (
          <Send className="w-3.5 h-3.5" />
        )}
      </button>
      {status === 'ERROR' && (
        <p className="text-[9px] text-red-400 mt-2 font-bold uppercase tracking-widest">Failed to subscribe</p>
      )}
    </form>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-12 md:gap-12">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div>
                <h3 className="font-display text-xl font-semibold">
                  Square<span className="text-secondary">21</span>
                </h3>
                <p className="text-primary-foreground/60 text-xs uppercase tracking-widest">Marketing</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Islamabad&apos;s premier real estate agency specializing in industrial, commercial, and residential properties across CDA sectors.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/share/1E5gtR1TDV/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                aria-label="Square21 Marketing on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/square21marketing?igsh=MW5hb3luczFyMXp5eQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                aria-label="Square21 Marketing on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/square21-marketing/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                aria-label="Square21 Marketing on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@square.21.marketin?_r=1&_t=ZS-94FNr6ropxy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                aria-label="Square21 Marketing on TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.03-.09z" /></svg>
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-display text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Properties', path: '/properties' },
                { name: 'Our Services', path: '/services' },
                { name: 'Market Reports', path: '/reports' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-display text-lg font-semibold mb-6">Newsletter</h4>
            <p className="text-primary-foreground/60 text-xs mb-4 leading-relaxed">
              Premium property insights delivered to your inbox.
            </p>
            <FooterNewsletter />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-display text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary" />
                <a href="tel:+923083333818" className="text-primary-foreground/70 hover:text-secondary text-sm">
                  +92 308 3333818
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary" />
                <a href="mailto:info@square21.pk" className="text-primary-foreground/70 hover:text-secondary text-sm">
                  info@square21.pk
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="section-container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © 2024 Square21 Marketing. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-primary-foreground/50 hover:text-primary-foreground text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-primary-foreground/50 hover:text-primary-foreground text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
