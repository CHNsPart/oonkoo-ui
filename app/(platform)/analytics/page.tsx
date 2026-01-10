import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Analytics",
  description: "Track your component performance",
};

// TODO: Implement analytics functionality
// - Component download counts
// - View/impression tracking
// - Revenue analytics for sellers
// - Time-series charts

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track the performance of your components
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Track downloads, views, and earnings for your components. Analytics will be available once you have published components.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
