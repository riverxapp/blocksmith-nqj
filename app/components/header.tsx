We need to create the file `app/components/header.tsx` as per the task instruction: "Create top header component at `app/components/header.tsx` with user avatar/dropdown (logout, profile)."

The user request is to build an internal CRM app. The context includes many tasks, but we are only to compile for this specific file. The task is clear: create a header component with user avatar and dropdown for logout and profile.

We should follow repository conventions: the code uses shadcn/ui, Tailwind, and Next.js 14+ App Router. We should use existing patterns from other components if visible, but we only have the file content of app/page.tsx, app/globals.css, app/layout.tsx. From layout.tsx we see they use ThemeProvider and Inter font. The directory structure likely has @/components and @/lib etc.

We need to create a header component that likely includes a user avatar/dropdown. Since it's an internal CRM, we might assume authentication is present (see other tasks about NextAuth and middleware). The header should show the current user's avatar and a dropdown with profile and logout options.

We'll use shadcn/ui components: Avatar, AvatarImage, AvatarFallback, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, etc. We'll also need to use `useSession` from NextAuth to get user info. But we don't know the exact auth setup yet; we can use a placeholder or assume a session object.

Given the design policy, we should handle states: loading (skeleton), logged out (maybe not needed if middleware redirects), and logged in. But for simplicity, we can assume the header is only rendered when user is authenticated (since middleware protects routes). So we can use `useSession` and show avatar with fallback initials.

Also need to import signOut from NextAuth. We'll use `import { signOut } from "next-auth/react"`.

We should also include a link to profile settings? The task says "profile" in dropdown, so we can include a "Profile" menu item that navigates to /settings or /profile. We'll use next/navigation useRouter for client-side navigation.

Make sure to wrap the component in a client component because it uses hooks (useSession, useRouter). Use "use client" directive.

We'll also include a mobile menu toggle maybe? But the task didn't specify, so we can keep it simple: left side might have app name/logo, right side has user avatar dropdown. However, the task only mentions user avatar/dropdown, so we can just do that part. But since it's a header, we might include a logo or app title. But the task instruction is specifically "Create top header component with user avatar/dropdown (logout, profile)." So we can focus on that.

We'll need to import required shadcn/ui components. Since we don't know if they exist, we should assume they are or will be created. But for compilation, we can just import them and trust the environment.

Structure:
- "use client"
- import { useSession } from "next-auth/react"
- import { useRouter } from "next/navigation"
- import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
- import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
- import { signOut } from "next-auth/react"

Render: a header element with flex justify-between items-center, padding, border-bottom. Left: maybe app name or logo placeholder. Right: DropdownMenu with Avatar as trigger. Dropdown items: Profile (link to /settings), Logout (call signOut).

Handle loading state: if session is loading, show a skeleton avatar using shadcn Skeleton? Or just a smaller placeholder.

We'll also add a user greeting or name in dropdown label.

We'll make sure to use cn() if needed, but we can just use className.

Now produce the final file content.
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <header className="flex h-14 items-center justify-between border-b px-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </header>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">CRM</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-9 w-9 cursor-pointer">
            {user?.image ? (
              <AvatarImage src={user.image} alt={user.name || "User"} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}