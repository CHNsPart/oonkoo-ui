import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "User Management",
  description: "Manage platform users",
};

// TODO: Implement user management
// - List all users with search/filter
// - View user details
// - Change user roles
// - Manage seller verification
// - Ban/suspend users

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage user accounts and permissions
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            User management features including role changes, seller verification, and account moderation are under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
