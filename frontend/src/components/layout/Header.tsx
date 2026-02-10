'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-border/10">
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Square21 Logo" className="w-10 h-10 object-contain" />
            <div className="hidden sm:block">
              <h1 className="text-secondary-foreground font-display text-xl font-semibold tracking-tight">
                Square<span className="text-primary">21</span>
              </h1>
              <p className="text-secondary-foreground/60 text-xs uppercase tracking-widest">Marketing</p>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors animated-underline ${isActive(link.path)
                  ? 'text-primary'
                  : 'text-secondary-foreground/80 hover:text-secondary-foreground'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+923001234567">
              <Button variant="ghost" size="sm" className="text-secondary-foreground/80 hover:text-secondary-foreground">
                <Phone className="w-4 h-4 mr-2" />
                +92 300 1234567
              </Button>
            </a>
            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-secondary-foreground p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-secondary border-t border-border/10 animate-slide-up">
          <nav className="section-container py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-medium py-2 ${isActive(link.path)
                  ? 'text-primary'
                  : 'text-secondary-foreground/80'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-border/10">
              <a href="tel:+923001234567">
                <Button variant="outline" className="w-full justify-start text-secondary-foreground border-secondary-foreground/20">
                  <Phone className="w-4 h-4 mr-2" />
                  +92 300 1234567
                </Button>
              </a>
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
