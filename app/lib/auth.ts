We need to compile the file app/lib/auth.ts based on the task instruction. The task is: "Task 13: update app/lib/auth.ts using unified diff." But we have no current file content for app/lib/auth.ts, and no diff is provided. The user gave a lot of context about planning a CRM app, but the actual request for compilation is to produce the final file content for app/lib/auth.ts.

Given that the current file content is empty or not provided, we need to create a suitable auth configuration file for a Next.js internal CRM using NextAuth v5 (Auth.js) with credentials provider. The task instruction from the earlier plan step: "Task 12: Task 3: Set up NextAuth v5 (Auth.js) with credentials provider: create `app/api/auth/[...nextauth]/route.ts` as the catch-all route, define auth config in `app/lib/auth.ts` with User model lookups and session callbacks."

So we should create app/lib/auth.ts with the NextAuth configuration, assuming Prisma for user lookup, and using credentials provider. Include imports, auth options, handlers, and exports. Follow best practices for NextAuth v5.

The output should be the final file content for app/lib/auth.ts, no explanations, no code fences, just the raw content.
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/app/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) {
          return null
        }

        const isValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})