'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Dashboard paths that should use the blue theme and larger text
  // We exclude paths like / (landing), /login, /signup, /forgot-password,
  // or redirect paths /rights and /awareness.
  const isDashboard = pathname && 
                      pathname !== '/' && 
                      pathname !== '/login' && 
                      pathname !== '/signup' && 
                      pathname !== '/forgot-password' &&
                      !pathname.startsWith('/rights') &&
                      !pathname.startsWith('/awareness');

  return (
    <div className={isDashboard ? 'theme-blue h-full min-h-screen w-full' : 'h-full min-h-screen w-full'}>
      {children}
    </div>
  );
}
