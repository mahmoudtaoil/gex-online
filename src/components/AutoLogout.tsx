'use client'

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'

export function AutoLogoutProvider({ 
  children, 
  timeoutMs = 5 * 60 * 1000 
}: { 
  children: React.ReactNode
  timeoutMs?: number 
}) {
  const { status } = useSession()
  const [last, setLast] = useState(Date.now())

  useEffect(() => {
    if (status !== 'authenticated') return

    const reset = () => setLast(Date.now())
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'focus']
    
    events.forEach(e => window.addEventListener(e, reset))
    
    const id = setInterval(() => {
      if (Date.now() - last > timeoutMs) {
        signOut({ callbackUrl: '/admin/login' })
      }
    }, 5000)

    return () => {
      events.forEach(e => window.removeEventListener(e, reset))
      clearInterval(id)
    }
  }, [last, status, timeoutMs])

  return <>{children}</>
}
