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
