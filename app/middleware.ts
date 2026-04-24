We need to create the auth middleware file. The user request is to build an internal CRM app, and Task 14 specifies creating app/middleware.ts to protect routes. We must output only the file content for app/middleware.ts.

Given the context, we should use Next.js middleware with NextAuth (probably v5/Auth.js) to check session. The middleware should redirect unauthenticated users to /login. We'll assume the auth config is in app/lib/auth.ts (as mentioned in other tasks). So we import auth from that module (or from next-auth/middleware if using next-auth). Since the task says "Create auth middleware", and we have NextAuth setup elsewhere, we'll use the next-auth middleware approach.

Standard pattern: export { auth as middleware } from '@/app/lib/auth' or use createMiddleware. But more explicit: we can check for authenticated user by reading the token. Actually, next-auth provides middleware by default: you can export { auth as middleware } from '@/lib/auth'. However, the task mentions "Create auth middleware in `app/middleware.ts` to protect all /dashboard, /contacts, /deals, /leads pages". So we'll implement a custom middleware that uses getToken or auth from Auth.js.

Given the context, we'll assume next-auth v5 (Auth.js) is used. So we can import { auth } from '@/app/lib/auth' and use it as middleware.

Example:

import { auth } from '@/app/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (!req.auth && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }
})

const protectedRoutes = ['/dashboard', '/contacts', '/deals', '/leads', '/activities', '/settings']

export const config = {
  matcher: protectedRoutes.map(route => `${route}/:path*`)
}

But the middlewarer might need to export named exports? Actually, next-auth's auth() returns a middleware function. So we export default auth(...).

Alternatively, we can use the simpler approach: export { auth as middleware } from '@/app/lib/auth' and have the auth function handle redirects. But since the task explicitly says "Create auth middleware in `app/middleware.ts`", we'll write a custom one.

Given that we have multiple tasks, but we only compile for this specific file. We'll produce the file content accordingly.

Make sure to include proper imports and logic.

Also check content policy: no markdown, just raw content. So output the code.
import { auth } from "@/app/lib/auth"
import { NextResponse } from "next/server"

const protectedPaths = ["/dashboard", "/contacts", "/deals", "/leads", "/activities", "/settings"]

export default auth((req) => {
  const { nextUrl } = req
  const isProtected = protectedPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  )

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", nextUrl)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/contacts/:path*", "/deals/:path*", "/leads/:path*", "/activities/:path*", "/settings/:path*"],
}