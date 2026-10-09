import { AppShell } from '@/components/layout/AppShell';

// Every page in here is per-user and behind auth, so never prerender it at build time.
export const dynamic = 'force-dynamic';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
