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
    <nav className="bg-blue-600 dark:bg-blue-700 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo/Title */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <span className="text-2xl">🗽</span>
            <span className="hidden sm:inline">US Citizenship Test</span>
            <span className="sm:hidden">USCIS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleItemClick(e, item)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  isActive(item)
                    ? 'bg-white text-blue-600 dark:bg-slate-100 dark:text-blue-700'
                    : 'text-white hover:bg-blue-700 dark:hover:bg-blue-800'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Dark Mode Toggle - Desktop */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 text-white hover:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-all"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-all"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  handleItemClick(e, item);
                  setMenuOpen(false);
                }}
                className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
                  isActive(item)
                    ? 'bg-white text-blue-600 dark:bg-slate-100 dark:text-blue-700'
                    : 'text-white hover:bg-blue-700 dark:hover:bg-blue-800'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg font-semibold text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-all"
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>

            {/* Settings Link - Mobile */}
            <Link
              href="/settings"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-lg font-semibold text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-all"
            >
              ⚙️ Settings
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
