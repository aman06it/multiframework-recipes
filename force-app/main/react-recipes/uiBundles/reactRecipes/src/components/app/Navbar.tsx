import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Code2, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchBar from './SearchBar';
import FrameworkSwitcher from './FrameworkSwitcher';

const navItems = [
  { to: '/hello', label: 'Hello' },
  { to: '/read-data', label: 'Read Data' },
  { to: '/modify-data', label: 'Modify Data' },
  { to: '/salesforce-apis', label: 'Salesforce APIs' },
  { to: '/integration', label: 'Integration' },
  { to: '/error-handling', label: 'Error Handling' },
  { to: '/styling', label: 'Styling' },
  { to: '/routing', label: 'Routing' },
  { to: '/embedding', label: 'Embedding' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function go(to: string) {
    navigate(to);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 border-b-2 border-b-primary/30 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <button
          className="flex shrink-0 items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={() => go('/')}
        >
          <Code2 className="h-5 w-5 text-primary" />
          <span className="hidden font-semibold tracking-tight sm:inline">
            Multi-Framework Recipes
          </span>
        </button>

        <FrameworkSwitcher />

        {/* Inline nav — desktop only */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map(({ to, label }) => {
            const isActive = pathname === to || pathname.startsWith(to + '/');
            return (
              <button
                key={to}
                onClick={() => go(to)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchBar />
          {/* Hamburger — mobile/tablet only */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-accent transition-colors lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <nav className="border-t border-border/60 bg-background/95 px-4 py-2 lg:hidden">
          <ul className="flex flex-col gap-0.5">
            {navItems.map(({ to, label }) => {
              const isActive = pathname === to || pathname.startsWith(to + '/');
              return (
                <li key={to}>
                  <button
                    onClick={() => go(to)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
