import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-headline font-bold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
          <CardDescription>Here's a quick overview of your business.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Analytics and summary widgets will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
