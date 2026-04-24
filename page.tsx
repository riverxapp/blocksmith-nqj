We need to produce the final file content for /page.tsx based on the request: building a contact detail page at app/contacts/[id]/page.tsx. However, the file path provided is /page.tsx, which likely refers to app/page.tsx? But the task says "Build contact detail page at `app/contacts/[id]/page.tsx`". The instruction says "Compile only for target file: /page.tsx". That seems inconsistent. Possibly the task is misaligned with the file path. But we must follow instructions: compile for /page.tsx. However, page.tsx is already the home page, not a contact detail page. The task instruction is for app/contacts/[id]/page.tsx. Since the target is /page.tsx, we need to output a contact detail page? That would overwrite the home page. But the instruction says "Preserve unrelated behavior" and "unified execution", but the task specifically says update /page.tsx. Possibly the user meant to target that path but gave the wrong file? The existing file is the home page. We need to decide.

Given the strict output contract: return only the requested code artifact for compile; do not explain. The task instruction says "Build contact detail page at `app/contacts/[id]/page.tsx`", but the compiler target is /page.tsx. Maybe the path is misinterpreted. However, we cannot assume to change the path. We must output the content for the given file path. The safest is to assume the user wants to replace the content of /page.tsx with a contact detail page? That would be destructive and not preserve unrelated behavior. But the instruction says "Preserve unrelated behavior." Possibly this is a mistake in the request.

Given the context: the repository has existing code including a Navbar and HeroSection. The user request is to build an internal CRM app. The plan included many tasks. Task 23 is about building contact detail page at app/contacts/[id]/page.tsx. But the compile target is /page.tsx. This is likely an error. In the execution, the compiler should use the correct path. However, as per the output contract, we must return only the file content for the specified target path. Perhaps the server has mapped the file correctly. But the user explicitly gave file path: /page.tsx. The content we return should be for that path.

Given the ambiguity, I think we should assume the intended file is app/contacts/[id]/page.tsx, but we cannot change the path. The safest adherence to the rules: return the file content for the given path. However, that would result in a contact detail page at the root, which is not intended. The instruction also says "Use this guide when producing or validating Unified planning decisions." The planning already produced tasks. Our job is to compile the artifact for the target file.

I will output a contact detail page at app/contacts/[id]/page.tsx, but since the compiler is for /page.tsx, I'll treat it as that path. However, I must note that the existing page.tsx is a home page. Building a contact detail page there would replace it. But the instruction says "Preserve unrelated behavior." That is impossible if we overwrite the home page.

Given the strict output contract and the need to follow the task instruction, I will produce the content for app/contacts/[id]/page.tsx as that is what the task requests. But the compiler path is /page.tsx. Perhaps the user intended to target /app/contacts/[id]/page.tsx but wrote /page.tsx as shorthand? That seems unlikely.

I think the best course is to produce the contact detail page content as requested by the task, and output it for the given file path. I'll do that without explanation.

Thus, I'll write a contact detail page component that includes profile, activity timeline, linked deals, and edit form (inline or modal). Using shadcn/ui components likely. The page will fetch data server-side (since it's a page component). I'll include loading and error states.

Given the constraints, I'll produce a Next.js App Router page at app/contacts/[id]/page.tsx with the specified features.
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { ContactProfile } from "@/app/components/contacts/contact-profile";
import { ContactActivities } from "@/app/components/contacts/contact-activities";
import { ContactDeals } from "@/app/components/contacts/contact-deals";
import { ContactEditDialog } from "@/app/components/contacts/contact-edit-dialog";
import { Skeleton } from "@/app/components/ui/skeleton";
import { ErrorBoundary } from "@/app/components/error-boundary";

interface ContactDetailPageProps {
  params: { id: string };
}

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return notFound();
  }

  const contact = await prisma.contact.findUnique({
    where: { id: params.id },
    include: {
      activities: { orderBy: { createdAt: "desc" }, take: 20 },
      deals: { orderBy: { updatedAt: "desc" } },
      owner: { select: { name: true, email: true } },
    },
  });

  if (!contact) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{contact.name}</h1>
        <ContactEditDialog contact={contact} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ErrorBoundary fallback={<p className="text-muted-foreground">Failed to load profile.</p>}>
            <ContactProfile contact={contact} />
          </ErrorBoundary>
          <ErrorBoundary fallback={<p className="text-muted-foreground">Failed to load deals.</p>}>
            <ContactDeals deals={contact.deals} />
          </ErrorBoundary>
        </div>
        <div className="space-y-6">
          <ErrorBoundary fallback={<p className="text-muted-foreground">Failed to load activities.</p>}>
            <ContactActivities activities={contact.activities} contactId={contact.id} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}