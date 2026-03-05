'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, MessageCircle, Facebook, Instagram, Linkedin } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Services', path: '/services' },
    { name: 'Reports', path: '/reports' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col font-sans">
      {/* Top Bar - Visible on all devices */}
      <div className="bg-primary text-primary-foreground py-2 lg:py-2.5 text-[10px] lg:text-[11px] font-medium tracking-widest uppercase z-50 relative border-b border-primary-foreground/10">
        <div className="section-container flex justify-between items-center">
          <div className="flex items-center gap-4 lg:gap-6">
            <span className="flex items-center gap-2 text-white/90 tracking-[0.2em] font-bold">
              <span>COMMERCIAL</span>
              <span className="text-secondary">|</span>
              <span>INDUSTRIAL</span>
            </span>
            <a href="mailto:info@square21.pk" className="hidden sm:flex items-center gap-1.5 lg:gap-2 hover:text-secondary transition-colors duration-300">
              <MessageCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-secondary" />
              <span>info@square21.pk</span>
            </a>
          </div>
          <div className="flex items-center gap-3 text-primary-foreground/60">
            <span className="hidden xl:inline">Follow Us:</span>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1E5gtR1TDV/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors duration-300"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
              </a>
              <div className="w-px h-3 bg-primary-foreground/20"></div>
              <a
                href="https://www.instagram.com/square21marketing?igsh=MW5hb3luczFyMXp5eQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors duration-300"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
              </a>
              <div className="w-px h-3 bg-primary-foreground/20"></div>
              <a
                href="https://www.linkedin.com/company/square21-marketing/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors duration-300"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
              </a>
              <div className="w-px h-3 bg-primary-foreground/20"></div>
              <a
                href="https://www.tiktok.com/@square.21.marketin?_r=1&_t=ZS-94FNr6ropxy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors duration-300"
                aria-label="Follow us on TikTok"
              >
                <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.03-.09z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-background/95 backdrop-blur-md border-b border-border shadow-sm w-full">
        <div className="section-container">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Mobile: Menu Button (Left) */}
            <button
              className="lg:hidden p-2 -ml-2 text-primary hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo (Center on Mobile, Left on Desktop) */}
            <Link href="/" className="flex items-center gap-2 lg:mr-8">
              <div className="block">
                <h1 className="text-primary font-display text-lg lg:text-xl font-bold tracking-tight leading-none">
                  Square<span className="text-secondary">21</span>
                </h1>
                <p className="text-muted-foreground text-[0.6rem] lg:text-xs uppercase tracking-[0.2em] leading-none mt-0.5">
                  Marketing
                </p>
              </div>
            </Link>

            {/* Desktop Navigation (Center) */}
            <nav className="hidden lg:flex items-center gap-8 mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-colors hover:text-secondary ${isActive(link.path)
                    ? 'text-secondary font-semibold'
                    : 'text-primary'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Desktop CTA */}
              <div className="hidden lg:flex">
                <a href="https://wa.me/923083333818" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-sm border border-transparent hover:border-secondary/50">
                    <MessageCircle className="w-4 h-4 mr-2 text-secondary" />
                    <span className="text-white">WhatsApp</span>
                  </Button>
                </a>
              </div>

              {/* Mobile CTA (Icon Only) */}
              <a
                href="tel:+923083333818"
                className="lg:hidden p-2 -mr-2 text-primary hover:bg-muted rounded-md transition-colors"
                aria-label="Call us"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-xl animate-slide-up">
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                    ? 'bg-primary/5 text-secondary'
                    : 'text-primary hover:bg-muted'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-border grid grid-cols-2 gap-3">
                <a href="tel:+923083333818" className="flex items-center justify-center gap-2 p-3 rounded-md bg-muted text-primary text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  Call
                </a>
                <a href="https://wa.me/923083333818" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-md bg-primary text-white text-sm font-medium">
                  <MessageCircle className="w-4 h-4 text-secondary" />
                  WhatsApp
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
