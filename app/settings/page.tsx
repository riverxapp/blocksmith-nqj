We need to generate the settings page for the CRM app. The user request is to build an internal CRM app, and we are at Task 26: Build settings page at app/settings/page.tsx with user profile edit, notification preferences, and team management (if admin).

We must follow the directives: use shadcn/ui components, Next.js App Router, server/client boundaries, etc. The page should include sections: user profile edit, notification preferences, team management (admin). Use existing components like Card, Form, Input, Select, Switch, Button, etc. We need to create the file from scratch since it doesn't exist.

The current file content is empty (none). So we need to output the full file content.

We should consider that we have an auth context, prisma, etc. The page will likely be client component for interactivity (forms). Use server actions? But the task instruction just says "build settings page". Keep it simple: a client component with tabs or sections. Use shadcn Card, Form, Input, Select, Switch, Button, Alert, etc. Also include team management for admin; maybe check user role from session.

We need to output final file content only, no code fences, no explanations.

We'll write a functional React component with hooks for state, useSession maybe from next-auth, and use of sonner toast. Since we don't have the actual auth provider details, we can use a placeholder or assume a hook like useSession from next-auth/react.

We'll structure as a page component in app/settings/page.tsx. Use "use client". Create sections: Profile, Notifications, Team. Use Tabs from shadcn.

We'll also include form fields for profile: name, email, avatar? Notifications: toggles for email, push. Team management: list of users with role select (for admin). Use a mock data fetch or server action? Since we need to keep it functional, we can assume there is an API endpoint or server action. We'll use fetch in useEffect or use server actions. But to keep compile simple, we can use fetch to /api/user for profile and /api/users for team (admin). We'll handle loading and error states.

We'll also include appropriate imports for shadcn components. Since we don't know if they exist, we should assume they are set up. The task instruction says we should create missing components in the same batch, but that's the planner's responsibility. For this file, we just produce the page.

We'll generate the file content.
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProfileData {
  name: string;
  email: string;
  image: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData>({ name: "", email: "", image: "" });
  const [notifications, setNotifications] = useState({ email: true, push: false, sms: false });
  const [team, setTeam] = useState<User[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const [errorTeam, setErrorTeam] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile({ name: data.name, email: data.email, image: data.image || "" });
        setNotifications({
          email: data.notifications?.email ?? true,
          push: data.notifications?.push ?? false,
          sms: data.notifications?.sms ?? false,
        });
      } catch (err: unknown) {
        setErrorProfile(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoadingProfile(false);
      }
    };
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch team");
        const data = await res.json();
        setTeam(data.users || []);
      } catch (err: unknown) {
        setErrorTeam(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoadingTeam(false);
      }
    };
    if (status === "authenticated") {
      fetchProfile();
      fetchTeam();
    } else if (status === "unauthenticated") {
      setLoadingProfile(false);
      setLoadingTeam(false);
    }
  }, [status]);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, image: profile.image }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifications),
      });
      if (!res.ok) throw new Error("Failed to update notifications");
      toast.success("Notification preferences saved");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      setTeam((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success("User role updated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const isAdmin = session?.user?.role === "admin";

  if (status === "loading") {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You must be logged in to view settings.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {isAdmin && <TabsTrigger value="team">Team</TabsTrigger>}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingProfile ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : errorProfile ? (
                <p className="text-destructive">{errorProfile}</p>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.image} alt={profile.name} />
                      <AvatarFallback>{profile.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={profile.email} disabled className="bg-muted" />
                    </div>
                  </div>
                  <Button onClick={handleProfileSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingProfile ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : errorProfile ? (
                <p className="text-destructive">{errorProfile}</p>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notif">Email notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email.</p>
                    </div>
                    <Switch id="email-notif" checked={notifications.email} onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notif">Push notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in browser.</p>
                    </div>
                    <Switch id="push-notif" checked={notifications.push} onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notif">SMS notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive SMS alerts for important events.</p>
                    </div>
                    <Switch id="sms-notif" checked={notifications.sms} onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })} />
                  </div>
                  <Button onClick={handleNotificationSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Preferences"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab (Admin only) */}
        {isAdmin && (
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Manage user roles and permissions.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTeam ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : errorTeam ? (
                  <p className="text-destructive">{errorTeam}</p>
                ) : team.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No team members found.</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {team.map((user) => (
                      <li key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                          <Select
                            value={user.role}
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}