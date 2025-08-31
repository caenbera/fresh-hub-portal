"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ManageUsersPage() {
  return (
    <RoleGuard allowedRoles={['superadmin']}>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-headline font-bold">Manage Users</h1>
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Assign and remove admin roles for users.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>A table of users with role management options will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
