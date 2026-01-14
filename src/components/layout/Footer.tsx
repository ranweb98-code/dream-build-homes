import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold">
              <Building2 className="h-8 w-8" />
              <span>Prestige Estates</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Your trusted partner in finding the perfect property. We specialize in luxury real estate and exceptional client service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/properties', label: 'Properties' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Property Types</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li>Luxury Villas</li>
              <li>Penthouses</li>
              <li>Waterfront Estates</li>
              <li>Modern Condos</li>
              <li>Historic Homes</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80">
                  123 Luxury Lane, Suite 100<br />
                  Beverly Hills, CA 90210
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 shrink-0" />
                <a href="tel:+1-555-123-4567" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 shrink-0" />
                <a href="mailto:info@prestigeestates.com" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  info@prestigeestates.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Prestige Estates. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
