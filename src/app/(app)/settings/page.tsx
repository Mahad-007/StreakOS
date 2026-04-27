'use client';

import { motion } from 'framer-motion';
import { Settings, Sun, Moon, User, LogOut } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { profile, signOut } = useAuth();

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Settings className="w-6 h-6 text-accent" />
            Settings
          </h1>
        </motion.div>

        {/* Profile section */}
        <motion.div
          className="p-5 rounded-xl border border-border bg-surface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <User className="w-4 h-4" /> Profile
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-xl font-bold text-accent">
                {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-text-primary">{profile?.full_name || 'Loading...'}</p>
              <p className="text-xs text-text-muted capitalize">{profile?.role || 'member'}</p>
            </div>
          </div>
        </motion.div>

        {/* Theme section */}
        <motion.div
          className="p-5 rounded-xl border border-border bg-surface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-semibold text-text-secondary mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-info" /> : <Sun className="w-5 h-5 text-warning" />}
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-xs text-text-muted">Toggle between dark and light themes</p>
              </div>
            </div>
            <motion.button
              onClick={toggleTheme}
              className="relative w-12 h-6 rounded-full bg-elevated border border-border transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-accent"
                animate={{ left: theme === 'dark' ? '2px' : '22px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Sign out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-danger/30 text-danger text-sm font-medium hover:bg-danger/5 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </motion.button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
