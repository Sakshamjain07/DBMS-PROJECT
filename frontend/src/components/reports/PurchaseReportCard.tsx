import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingCart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo } from "react";

const allPurchaseData = [
  { month: "Jul", amount: 28000 },
  { month: "Aug", amount: 32000 },
  { month: "Sep", amount: 29000 },
  { month: "Oct", amount: 38000 },
  { month: "Nov", amount: 35000 },
  { month: "Dec", amount: 42000 },
  { month: "Jan", amount: 28000 },
  { month: "Feb", amount: 32000 },
  { month: "Mar", amount: 29000 },
  { month: "Apr", amount: 38000 },
  { month: "May", amount: 35000 },
  { month: "Jun", amount: 42000 },
];

const topSuppliers = [
  { name: "Tech Supplies Co.", orders: 45, spending: 125000, avgTime: "3 days" },
  { name: "Global Parts Inc.", orders: 38, spending: 98000, avgTime: "5 days" },
  { name: "Quality Materials", orders: 32, spending: 87000, avgTime: "4 days" },
  { name: "Fast Logistics", orders: 28, spending: 76000, avgTime: "2 days" },
];

const PurchaseReportCard = ({ dateRange }: { dateRange: string }) => {
  const purchaseData = useMemo(() => {
    const monthsMap = {
      "1month": 1,
      "3months": 3,
      "6months": 6,
      "1year": 12,
    };
    const months = monthsMap[dateRange as keyof typeof monthsMap] || 6;
    return allPurchaseData.slice(-months);
  }, [dateRange]);

  const totalPurchases = useMemo(() => {
    return purchaseData.reduce((sum, item) => sum + item.amount, 0);
  }, [purchaseData]);
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Purchase Report
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Supplier spending and order frequency
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">${(totalPurchases / 1000).toFixed(0)}K</p>
            <p className="text-sm text-muted-foreground">Total purchases</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Monthly Purchase Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={purchaseData}>
              <defs>
                <linearGradient id="purchaseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="hsl(var(--chart-1))" 
                fill="url(#purchaseGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Top Suppliers Performance</h4>
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-foreground font-semibold">Supplier</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Orders</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Spending</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Avg. Delivery</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSuppliers.map((supplier) => (
                  <TableRow key={supplier.name} className="border-border">
                    <TableCell className="font-medium text-foreground">{supplier.name}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{supplier.orders}</TableCell>
                    <TableCell className="text-right text-foreground font-semibold">
                      ${supplier.spending.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{supplier.avgTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseReportCard;
