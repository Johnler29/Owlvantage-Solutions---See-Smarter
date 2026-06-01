import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

/**
 * Navigation Component
 * Design Philosophy: Modern Corporate Minimalism
 * - Clean, professional header with teal accent
 * - Responsive mobile menu
 * - Logo and navigation links with hover effects
 */
export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/seminars", label: "Seminars" },
    { href: "/contact", label: "Contact" },
  ];

  const normalizePath = (path) => (path.length > 1 ? path.replace(/\/+$/, "") : path);
  const currentPath = normalizePath(location);
  const isActive = (href) => normalizePath(href) === currentPath;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer focus-ring-teal rounded-lg">
            <img
              src="/logo.png"
              alt="Owlvantage - See Smarter"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
            />
            {/* Hide full logo text on tablets to prevent nav overflow */}
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-[#1b2e45]">Owlvantage</h1>
              <p className="text-xs text-[#25badf] font-semibold">See Smarter</p>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={
                  isActive(link.href)
                    ? "text-[#25badf] font-semibold text-sm lg:text-base whitespace-nowrap transition-all duration-200 border-b-2 border-[#25badf] pb-1 focus-ring-teal rounded"
                    : "text-gray-700 font-medium text-sm lg:text-base whitespace-nowrap hover:text-[#25badf] transition-all duration-200 focus-ring-teal rounded"
                }
              >
                {link.label}
              </span>
            </Link>
          ))}
          <Link href="/contact">
            <span className="btn-primary inline-block px-4 py-2 text-sm md:text-sm lg:text-base whitespace-nowrap lg:px-6 lg:py-3">
              Get Started
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-[#25badf] transition-colors rounded-lg focus-ring-teal"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 py-4 animate-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={
                    isActive(link.href)
                      ? "text-[#25badf] font-semibold transition-colors block py-2 px-3 rounded-lg bg-[#25badf]/5"
                      : "text-gray-700 font-medium hover:text-[#25badf] hover:bg-slate-50 transition-colors block py-2 px-3 rounded-lg"
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/contact">
              <span
                className="btn-primary block text-center"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
