'use client'

import { SessionProvider } from 'next-auth/react'
import { AutoLogoutProvider } from '@/components/AutoLogout'

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <SessionProvider>
      <AutoLogoutProvider>
        {children}
      </AutoLogoutProvider>
    </SessionProvider>
  )
}
