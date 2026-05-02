import { Linkedin, Facebook, Twitter } from "lucide-react";
import { Link } from "wouter";

/**
 * Footer Component
 * Design Philosophy: Modern Corporate Minimalism
 * - Professional footer with company info and links
 * - Social media integration
 * - Clean, organized layout
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1b2e45] text-white">
        <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#25badf]">Owlvantage Solutions</h3>
            <p className="text-gray-300 text-sm mb-4">
              Empowering organizations through innovative learning and technology solutions.
            </p>
            <p className="text-gray-400 text-sm">See Smarter</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-[#25badf]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-gray-300 hover:text-[#25badf] transition-colors">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-gray-300 hover:text-[#25badf] transition-colors">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <span className="text-gray-300 hover:text-[#25badf] transition-colors">Services</span>
                </Link>
              </li>
              <li>
                <Link href="/seminars">
                  <span className="text-gray-300 hover:text-[#25badf] transition-colors">Seminars</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4 text-[#25badf]">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#25badf] transition-colors">
                  Learning Solutions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#25badf] transition-colors">
                  IT Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#25badf] transition-colors">
                  Workshops & Seminars
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#25badf] transition-colors">
                  Advisory Services
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-bold mb-4 text-[#25badf]">Contact</h4>
            <p className="text-gray-300 text-sm mb-4">
              <a href="mailto:info@owlvantage.com" className="hover:text-[#25badf] transition-colors">
                info@owlvantage.com
              </a>
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-300 hover:text-[#25badf] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.facebook.com/owlvantagesolutions"
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:text-[#25badf] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-[#25badf] transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400 text-sm">
            &copy; {currentYear} Owlvantage Solutions, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
