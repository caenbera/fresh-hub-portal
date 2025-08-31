import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function NewOrderPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-headline font-bold">Place a New Order</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>Browse our products and add them to your order.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A list of available products for ordering will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
