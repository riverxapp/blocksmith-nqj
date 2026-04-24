We need to create the sidebar navigation component as per the task. The task is to create `app/components/sidebar.tsx` with links to Dashboard, Contacts, Leads, Deals, Activities, Settings; use active link highlighting and collapsible on mobile. Since this is a new file, we need to generate the full content. The code type is nextjs, and we should use shadcn/ui components as per the overlay. So we'll use the `Sheet` for mobile nav, `Navigation Menu` maybe, but simplest is a collapsible sidebar using state. We'll use `usePathname` from next/navigation for active link highlighting. Also we need to use `cn` utility for merging classes. We'll assume the existence of `@/lib/utils` for `cn`. The sidebar should be collapsible on mobile using a button to toggle. We can use a `Sheet` component for mobile overlay. However, the task says "active link highlighting and collapsible on mobile" - we can implement a responsive sidebar that on desktop is visible, on mobile is hidden and toggled via a hamburger button. We'll use the `Sheet` component for the mobile drawer. We'll also need to import `Link` from next/link.

Given the context, we should produce the file content. We'll write a clean, functional React component.

We'll assume the following dependencies exist: `next/link`, `next/navigation`, `@/lib/utils` (for cn), and shadcn/ui's `Sheet`, `Button`, `ScrollArea`. We'll also need a menu icon from lucide-react (likely available). We'll define the nav items as an array.

We'll produce final file content.
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  Target,
  TrendingUp,
  Activity,
  Settings,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/leads", label: "Leads", icon: Target },
  { href: "/deals", label: "Deals", icon: TrendingUp },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const desktopSidebar = (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4 font-semibold">
        CRM
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );

  const mobileSidebar = (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-14 items-center border-b px-4 font-semibold">
          CRM
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 px-3 py-2">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
}