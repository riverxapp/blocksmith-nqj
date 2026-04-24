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
