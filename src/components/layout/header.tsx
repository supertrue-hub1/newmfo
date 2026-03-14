'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Menu, X, CreditCard, Scale, BookOpen, FileText, User, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const navLinks = [
  { href: '#offers', label: 'Займы', icon: CreditCard },
  { href: '/sravnit', label: 'Сравнить', icon: Scale },
  { href: '/blog', label: 'Блог', icon: BookOpen },
  { href: '#faq', label: 'FAQ', icon: FileText },
];

// Simple theme toggle button
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
        aria-label="Переключить тему"
      >
        <Sun className="h-4 w-4 text-muted-foreground" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
      aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-foreground" />
      ) : (
        <Moon className="h-4 w-4 text-foreground" />
      )}
    </button>
  );
}

export function Header({ className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        'bg-background/80 backdrop-blur-md',
        'border-b border-border',
        className
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm transition-shadow group-hover:shadow-md">
            <CreditCard className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">
            cash<span className="text-primary">peek</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <ThemeToggle />
          <Button asChild variant="outline" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground">
            <a href="/cabinet">
              <User className="mr-2 h-4 w-4" />
              Кабинет
            </a>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 border-t border-border pt-4">
              <Button asChild variant="outline" className="w-full border-border text-foreground hover:bg-accent">
                <a href="/cabinet" onClick={() => setMobileMenuOpen(false)}>
                  <User className="mr-2 h-4 w-4" />
                  Кабинет
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
