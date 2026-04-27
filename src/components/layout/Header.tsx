'use client';

import { motion } from 'framer-motion';
import { Sun, Moon, LogOut, Menu } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Mobile menu + page context */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </motion.button>

          {/* User avatar */}
          {profile && (
            <div className="flex items-center gap-3 pl-2 ml-2 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-sm font-bold text-accent">
                  {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-text-primary">
                {profile.full_name}
              </span>
              <motion.button
                onClick={signOut}
                className="p-1.5 rounded-lg text-text-muted hover:text-danger transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
