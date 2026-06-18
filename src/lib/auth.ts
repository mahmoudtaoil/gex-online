import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        email: { label: 'User', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = process.env.ADMIN_USER || 'gex'
        const pass = process.env.ADMIN_PASS || '0964'

        if (credentials?.email === user && credentials?.password === pass) {
          return { id: '1', name: 'Admin', email: 'admin@gex' }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 5 * 60,   // 5 دقائق
    updateAge: 60,     // يجدد كل دقيقة لو في حركة
  },
  jwt: {
    maxAge: 5 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}
