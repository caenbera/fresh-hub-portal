import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ManageOrdersPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-headline font-bold">Manage Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Customer Orders</CardTitle>
          <CardDescription>View, track, and update order statuses.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A table of all orders will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
