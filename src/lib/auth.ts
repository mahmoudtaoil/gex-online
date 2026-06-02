import { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Admin',
      credentials: {
        email: { label: 'User', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = process.env.ADMIN_USER || 'gex'
        const pass = process.env.ADMIN_PASS || '0964'
        
        if (credentials?.email === user && credentials?.password === pass) {
          return { id: '1', name: 'Admin', email: 'admin@gex' }
        }
        return null
      }
    })
  ],
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET
}