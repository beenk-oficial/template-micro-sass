'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Zap } from 'lucide-react';
import { useWhitelabel } from '@/hooks/useWhitelabel';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { name, logo } = useWhitelabel();

  return (
    <nav className="bg-background border-b border-primary/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center cursor-pointer">
              <img
                src={logo}
                alt={`${name} logo`}
                className="w-full h-8 object-contain"
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="#features" className="text-secondary-foreground  transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-secondary-foreground  transition-colors">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-secondary-foreground  transition-colors">
                Testimonials
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-secondary-foreground "
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link href="#features" className="block px-3 py-2 text-secondary-foreground ">
                Features
              </Link>
              <Link href="#pricing" className="block px-3 py-2 text-secondary-foreground ">
                Pricing
              </Link>
              <Link href="#testimonials" className="block px-3 py-2 text-secondary-foreground ">
                Testimonials
              </Link>
              <div className="border-t pt-4 mt-4">
                <Link href="/auth/signin" className="block px-3 py-2">
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </Link>
                <Link href="/auth/signup" className="block px-3 py-2">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}