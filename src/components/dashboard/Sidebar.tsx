'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Component, 
  GitMerge, 
  Mic, 
  PenTool,
  LayoutDashboard
} from 'lucide-react';

const NAV_ITEMS = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: 'AI Design Generator',
    href: '/dashboard/ai-generator',
    icon: Sparkles,
    exact: false
  },
  {
    title: 'HLD Practice',
    href: '/dashboard/hld',
    icon: Component,
    exact: false
  },
  {
    title: 'LLD Practice',
    href: '/dashboard/lld',
    icon: GitMerge,
    exact: false
  },
  {
    title: 'Mock Interview',
    href: '/dashboard/interview',
    icon: Mic,
    exact: false
  },
  {
    title: 'Blank Canvas',
    href: '/dashboard/canvas',
    icon: PenTool,
    exact: false
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] flex flex-col bg-surface border-r border-primary/10 shrink-0 h-full">
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2 no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden
                ${isActive 
                  ? 'bg-primary/5 text-primary-ink font-semibold' 
                  : 'text-primary/70 hover:bg-bg hover:text-primary font-medium'}
              `}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="shrink-0" size={20} />
              
              <span className="whitespace-nowrap overflow-hidden text-sm">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-primary/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20">
          <div className="shrink-0 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-primary">System Online</span>
        </div>
      </div>
    </aside>
  );
}
