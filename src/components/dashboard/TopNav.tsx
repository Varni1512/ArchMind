'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { Bell, Search, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function TopNav() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[40] w-full bg-surface/80 backdrop-blur-xl border-b border-primary/10 px-6 py-3">
      <div className="flex items-center justify-between h-full">
        
        {/* Left - Logo */}
        <div className="flex items-center gap-[9px] font-heading font-extrabold text-[19px] text-primary w-64 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-[9px] hover:opacity-80 transition-opacity">
            <LogoIcon />
            ArchMind
          </Link>
        </div>

        {/* Right - Notifications & Avatar */}
        <div className="flex items-center justify-end gap-6 w-64 shrink-0">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <div className="h-8 w-8 rounded-full bg-accent/30 text-primary flex items-center justify-center font-bold text-sm border border-accent">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-primary leading-none mb-1">
                  {user?.name || 'User'}
                </p>
                {/* <p className="text-xs text-primary/60 leading-none">Free Plan</p> */}
              </div>
              <ChevronDown className={`h-4 w-4 text-primary/60 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-primary/10 py-1 overflow-hidden z-50"
                >
                  <div className="px-4 py-2 border-b border-primary/5 sm:hidden">
                    <p className="text-sm font-medium text-primary truncate">{user?.name}</p>
                    <p className="text-xs text-primary/60 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-[13.5px] font-medium text-warn hover:bg-warn/10 transition-colors cursor-pointer mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </header>
  );
}
