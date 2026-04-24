We need to produce the file content for Auth.js based on the request. The request is about setting up NextAuth v5 (Auth.js) with credentials provider for a CRM app. However, the user's instruction says "Compile only for target file: Auth.js". But Auth.js is not a valid Next.js file path; it likely refers to a file related to authentication configuration. The task instruction mentions creating `app/lib/auth.ts` and `app/api/auth/[...nextauth]/route.ts`. But the output contract says to return only the requested code artifact for compile. The target file is "Auth.js", but that might be a placeholder. Since the instruction says "Compile only for target file: Auth.js", but the actual file path should be something like `app/lib/auth.ts` or the route file. However, the user provided "Auth.js" as the file path in the output contract. Perhaps they want the content of the auth configuration file. Let's examine the task: "Task 3: Set up NextAuth v5 (Auth.js) with credentials provider: create `app/api/auth/[...nextauth]/route.ts` as the catch-all route, define auth config in `app/lib/auth.ts` with User model lookups and session callbacks."

So there are two files. The output contract says "Compile only for target file: Auth.js". This could mean compile the content for the file "Auth.js" which might be a misspelling of `auth.ts` in `app/lib/`. But the file path in the contract is "Auth.js". However, the user wants the final file content for that target. Since the instruction is confusing, I'll assume they want the content of the auth configuration file, i.e., `app/lib/auth.ts`. I'll produce the content of `app/lib/auth.ts` with the NextAuth v5 configuration using credentials provider, including User model lookups and session callbacks, as described. Also, I'll include the route file content? No, only one file per task. The task says "create app/api/auth/[...nextauth]/route.ts as the catch-all route, define auth config in app/lib/auth.ts". That's two files. But the compile target is Auth.js, which is ambiguous. To adhere to the output contract, I'll produce the content for `app/lib/auth.ts` as that seems to be the primary auth config. I'll name the file Auth.js? But in Next.js, it should be .ts. The user may have intended .ts. I'll output the TypeScript content. And the file path should be "Auth.js" as per the contract, but that's a filename. I'll just return the code block? No, per rules: "Return only the final file content text. Do not include explanations... markdown, or code fences." So I must return the raw content without any formatting. The content should be the TypeScript code for the auth config.

I'll write a typical NextAuth v5 (Auth.js) config with credentials provider, using Prisma for user lookup, and session callbacks. Also include an auth handler for the route file? No, only one file. I'll focus on the config file.

I'll assume Prisma is used, as per context. I'll export auth, signIn, signOut, handlers. This is the standard pattern for Auth.js v5.

Let me produce the content.
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import { compare } from "bcryptjs"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
 
        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) }
        })
 
        if (!user) return null
 
        const isValid = await compare(String(credentials.password), user.password)
        if (!isValid) return null
 
        return {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    signUp: "/register"
  },
  session: {
    strategy: "jwt"
  }
})