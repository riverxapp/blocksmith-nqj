We need to generate the content for app/dashboard/page.tsx based on the task description: summary cards (total contacts, active deals, lead conversion rate, recent activities) using server-side data fetching. The project uses Next.js with App Router, shadcn/ui, and Prisma presumably. The dashboard is an internal CRM page, so it should show various metrics.

We'll create a page that fetches data server-side and displays summary cards. We should assume the existence of a database client (app/lib/db.ts) and perhaps API routes or direct database queries. Since it's server-side data fetching, we can use server components.

We'll create a page component that exports an async function, fetches data, and renders a grid of cards. Cards can use the shadcn Card component. We'll need to handle empty states? The task says summary cards, so we assume there is data, but we should handle zero values gracefully. We'll include loading skeleton? The page is server-side so loading state would be handled by loading.tsx at the route level. We'll focus on the page content.

We need to import from @/components/ui/card. We'll need to compute counts: total contacts, active deals, lead conversion rate, recent activities. We'll assume models: Contact, Deal, Lead, Activity. We'll fetch from Prisma.

We'll write the file content.

Also note the existing globals.css has shadcn variables. The layout already includes providers.

We'll produce the final file content only.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/app/lib/db";

async function getDashboardStats() {
  const totalContacts = await db.contact.count();
  const activeDeals = await db.deal.count({ where: { status: "active" } });
  const totalLeads = await db.lead.count();
  const convertedLeads = await db.lead.count({ where: { status: "converted" } });
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  const recentActivities = await db.activity.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } });
  return { totalContacts, activeDeals, conversionRate, recentActivities };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalContacts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeDeals}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lead Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.conversionRate}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentActivities}</div>
        </CardContent>
      </Card>
    </div>
  );
}