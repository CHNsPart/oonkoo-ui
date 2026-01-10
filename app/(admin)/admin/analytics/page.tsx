import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Admin Analytics",
  description: "Platform analytics and metrics",
};

// TODO: Implement admin analytics
// - Total users, components, downloads
// - Revenue metrics
// - User growth charts
// - Component popularity trends
// - Geographic distribution

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Platform-wide metrics and insights
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Platform analytics including user growth, component downloads, and revenue metrics are under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
