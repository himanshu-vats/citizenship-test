'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/lib/ThemeContext';

export default function TopNav({ activeSection = null, onTestClick = null, onHomeClick = null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Home', href: '/', id: 'home' },
    { label: 'Study', href: '/study', id: 'study' },
    { label: 'Test', href: '/?startTest=true', id: 'test' },
    { label: 'Posts', href: '/blog-simple', id: 'posts' },
    { label: 'Stats', href: '/stats', id: 'stats' },
  ];

  const isActive = (item) => {
    // If activeSection prop is provided, use it to determine active state
    if (activeSection) {
      return item.id === activeSection;
    }

    // Default behavior based on pathname
    if (item.id === 'home') {
      return pathname === '/' && !activeSection;
    }
    if (item.id === 'test') {
      return false; // Test is only active when explicitly set via activeSection
    }
    if (item.href === '/') {
      return false;
    }
    return pathname.startsWith(item.href);
  };

  const handleItemClick = (e, item) => {
    if (item.id === 'test' && onTestClick) {
      e.preventDefault();
      onTestClick();
      setMenuOpen(false);
    } else if (item.id === 'home' && onHomeClick) {
      e.preventDefault();
      onHomeClick();
      setMenuOpen(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo/Title */}
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-xl lg:text-2xl group">
            <span className="text-3xl lg:text-4xl group-hover:scale-110 transition-transform">🗽</span>
            <div className="flex flex-col">
              <span className="leading-tight">CivicsPass.com</span>
              <span className="text-xs font-normal text-blue-100 dark:text-blue-200 hidden sm:block">U.S. Citizenship Test Prep 2025</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleItemClick(e, item)}
                className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                  isActive(item)
                    ? 'bg-white text-blue-600 shadow-md transform scale-105'
                    : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Dark Mode Toggle - Desktop */}
            <button
              onClick={toggleTheme}
              className="ml-3 p-3 text-white hover:bg-white/20 rounded-xl transition-all hover:scale-105"
              aria-label="Toggle dark mode"
            >
              <span className="text-xl">{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-3 rounded-xl text-white hover:bg-white/20 transition-all"
            aria-label="Menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {menuOpen && (
          <div className="lg:hidden pb-6 pt-2 space-y-3 border-t border-white/20">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  handleItemClick(e, item);
                  setMenuOpen(false);
                }}
                className={`block px-5 py-4 rounded-xl font-semibold text-lg transition-all ${
                  isActive(item)
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-white/20 space-y-3">
              {/* Dark Mode Toggle - Mobile */}
              <button
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-5 py-4 rounded-xl font-semibold text-lg text-white hover:bg-white/20 transition-all"
              >
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>

              {/* Settings Link - Mobile */}
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-4 rounded-xl font-semibold text-lg text-white hover:bg-white/20 transition-all"
              >
                ⚙️ Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
