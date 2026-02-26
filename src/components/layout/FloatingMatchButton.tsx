import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingMatchButton() {
  const location = useLocation();

  // Hide on the match page itself
  if (location.pathname === '/match') return null;

  return (
    <Link
      to="/match"
      className={cn(
        'fixed right-4 bottom-6 z-40 flex items-center gap-2 rounded-full px-5 py-3',
        'bg-primary text-primary-foreground shadow-lg',
        'hover:scale-105 active:scale-95 transition-transform duration-200',
        'md:right-6 md:bottom-8'
      )}
    >
      <Sparkles className="h-5 w-5" />
      <span className="text-sm font-semibold whitespace-nowrap">Find My Home</span>
    </Link>
  );
}
