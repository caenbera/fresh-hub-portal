import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function OrderHistoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-headline font-bold">Your Order History</h1>
       <Card>
        <CardHeader>
          <CardTitle>Past Orders</CardTitle>
          <CardDescription>Here you can find all your previous orders and their statuses.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A table of your past orders will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
