import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign } from "lucide-react";
import { useMemo } from "react";

const allSalesData = [
  { month: "Jul", revenue: 42000, orders: 115 },
  { month: "Aug", revenue: 45000, orders: 120 },
  { month: "Sep", revenue: 52000, orders: 145 },
  { month: "Oct", revenue: 48000, orders: 132 },
  { month: "Nov", revenue: 61000, orders: 168 },
  { month: "Dec", revenue: 55000, orders: 151 },
  { month: "Jan", revenue: 45000, orders: 120 },
  { month: "Feb", revenue: 52000, orders: 145 },
  { month: "Mar", revenue: 48000, orders: 132 },
  { month: "Apr", revenue: 61000, orders: 168 },
  { month: "May", revenue: 55000, orders: 151 },
  { month: "Jun", revenue: 67000, orders: 189 },
];

const topProducts = [
  { name: "Widget A", sales: 1250, revenue: 37500 },
  { name: "Widget B", sales: 980, revenue: 29400 },
  { name: "Widget C", sales: 875, revenue: 26250 },
  { name: "Widget D", sales: 654, revenue: 19620 },
  { name: "Widget E", sales: 432, revenue: 12960 },
];

const SalesReportCard = ({ dateRange }: { dateRange: string }) => {
  const salesData = useMemo(() => {
    const monthsMap = {
      "1month": 1,
      "3months": 3,
      "6months": 6,
      "1year": 12,
    };
    const months = monthsMap[dateRange as keyof typeof monthsMap] || 6;
    return allSalesData.slice(-months);
  }, [dateRange]);

  const totalRevenue = useMemo(() => {
    return salesData.reduce((sum, item) => sum + item.revenue, 0);
  }, [salesData]);
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Sales Report
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Revenue trends and top-selling items
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">${(totalRevenue / 1000).toFixed(0)}K</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-[hsl(var(--chart-2))]" />
              +12.5% vs last period
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Monthly Revenue & Orders</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
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
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-1))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Top Selling Products</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                width={80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesReportCard;
