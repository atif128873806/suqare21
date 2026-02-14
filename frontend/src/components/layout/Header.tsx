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
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col font-sans">
      {/* Top Bar - Desktop Only */}
      {/* Top Bar - Visible on all devices */}
      <div className="bg-neutral-900 text-white py-2 lg:py-2.5 text-[10px] lg:text-[11px] font-medium tracking-widest uppercase z-50 relative border-b border-white/5">
        <div className="section-container flex justify-between items-center">
          <div className="flex items-center gap-4 lg:gap-6">
            <span className="flex items-center gap-2 text-primary tracking-[0.2em] font-bold">
              <span>COMMERCIAL</span>
              <span className="text-white/20">|</span>
              <span>INDUSTRIAL</span>
            </span>
            <a href="mailto:info@square21.pk" className="hidden sm:flex items-center gap-1.5 lg:gap-2 hover:text-primary transition-colors duration-300">
              <MessageCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary" />
              <span>info@square21.pk</span>
            </a>
          </div>
          <div className="flex items-center gap-3 text-white/60">
            <span className="hidden xl:inline">Follow Us:</span>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-primary transition-colors duration-300"><Facebook className="w-3 h-3 lg:w-3.5 lg:h-3.5" /></a>
              <div className="w-px h-3 bg-white/20"></div>
              <a href="#" className="hover:text-primary transition-colors duration-300"><Instagram className="w-3 h-3 lg:w-3.5 lg:h-3.5" /></a>
              <div className="w-px h-3 bg-white/20"></div>
              <a href="#" className="hover:text-primary transition-colors duration-300"><Linkedin className="w-3 h-3 lg:w-3.5 lg:h-3.5" /></a>
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
              className="lg:hidden p-2 -ml-2 text-foreground hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo (Center on Mobile, Left on Desktop) */}
            <Link href="/" className="flex items-center gap-2 lg:mr-8">
              <div className="relative w-8 h-8 lg:w-10 lg:h-10">
                <img src="/logo.png" alt="Square21" className="object-contain w-full h-full" />
              </div>
              <div className="block">
                <h1 className="text-foreground font-display text-lg lg:text-xl font-bold tracking-tight leading-none">
                  Square<span className="text-primary">21</span>
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
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path)
                    ? 'text-primary'
                    : 'text-muted-foreground'
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
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              </div>

              {/* Mobile CTA (Icon Only) */}
              <a href="tel:+923083333818" className="lg:hidden p-2 -mr-2 text-foreground hover:bg-muted rounded-md transition-colors">
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
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-border grid grid-cols-2 gap-3">
                <a href="tel:+923083333818" className="flex items-center justify-center gap-2 p-3 rounded-md bg-muted text-foreground text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  Call
                </a>
                <a href="https://wa.me/923083333818" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-md bg-primary text-primary-foreground text-sm font-medium">
                  <MessageCircle className="w-4 h-4" />
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
