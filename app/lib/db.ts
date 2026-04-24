We need to create the file `app/lib/db.ts` with a singleton Prisma client. The task is to create a shared database client module that exports a singleton Prisma client. The file does not exist yet, so we will output the full file content. According to the instructions, we should return only the final file content without any markdown or code fences. So we will output the content directly.

The Prisma client singleton pattern for Next.js is to use `globalThis.prisma` to prevent multiple instances during hot reloading. We'll follow that pattern.

We'll write:

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

But we need to consider the existing repo context. There's no existing db module, so we'll create this standard pattern. The task says "exports a singleton Prisma client". This is good.

We'll output just the content.

We must ensure no extra text.
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db