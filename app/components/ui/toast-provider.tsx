We need to create a new file: app/components/ui/toast-provider.tsx. The task says to add a reusable toast notification component using sonner. We should create a component that wraps the Toaster from sonner and exports it. Also note that later tasks will import it in layout. The file should be created with standard sonner Toaster setup. Use TypeScript. Also ensure it's a client component because it uses hooks? Actually sonner Toaster is a component that can be used in server components but it's fine. Usually you'd make it a client component if you need interactivity, but Toaster itself doesn't need 'use client'? It might need it because it uses browser APIs. Typically, in Next.js App Router, you'd put 'use client' because it uses context. So we'll add 'use client' directive.

Content: Use Sonner's Toaster component with default props. Also provide a toast function export? The task says "reusable toast notification component", but typically you just need the Toaster and then use toast() from sonner elsewhere. We can export the Toaster as default. Also consider including provider for theme? Not needed. We'll keep simple.

We'll create the file with proper imports and export.
"use client";

import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

export function ToastProvider({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      position="top-right"
      closeButton
      richColors
      {...props}
    />
  );
}

export { toast } from "sonner";