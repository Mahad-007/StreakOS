'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types';

const PUBLIC_PATHS = ['/', '/login'];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const profileCache = useRef<Profile | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      // Use cache to avoid refetching on every auth event
      if (profileCache.current?.id === userId) {
        if (mounted) setProfile(profileCache.current);
        return;
      }
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (mounted && data) {
          profileCache.current = data;
          setProfile(data);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      }
    };

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          if (!PUBLIC_PATHS.includes(pathname)) {
            router.replace('/login');
          }
        }
        return;
      }

      if (mounted) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          profileCache.current = null;
          router.replace('/login');
          return;
        }

        // For SIGNED_IN, TOKEN_REFRESHED, etc. — update user if session exists
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, profile, loading, signOut, supabase };
}
