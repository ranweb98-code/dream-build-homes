import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Building2, Users, Phone, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/match', label: 'Find My Home', icon: Sparkles },
  { href: '/about', label: 'About', icon: Users },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-display text-2xl font-bold text-primary"
            >
              <Building2 className="h-8 w-8" />
              <span>Prestige Estates</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    location.pathname === link.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {user && isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Slide-over */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-background shadow-2xl transition-transform duration-300 ease-out md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <span className="font-display text-xl font-bold text-primary">
              Menu
            </span>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'flex items-center gap-4 px-6 py-4 text-lg font-medium transition-colors',
                    location.pathname === link.href
                      ? 'bg-primary/5 text-primary border-r-4 border-primary'
                      : 'text-foreground hover:bg-muted'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Footer - only show admin link if user is admin */}
          {user && isAdmin && (
            <div className="p-6 border-t">
              <Link to="/admin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full gap-2">
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
