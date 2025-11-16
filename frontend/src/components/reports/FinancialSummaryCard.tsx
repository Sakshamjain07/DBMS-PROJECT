import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useMemo } from "react";

const allFinancialData = [
  { month: "Jul", revenue: 42000, costs: 28000, profit: 14000 },
  { month: "Aug", revenue: 45000, costs: 28000, profit: 17000 },
  { month: "Sep", revenue: 52000, costs: 32000, profit: 20000 },
  { month: "Oct", revenue: 48000, costs: 29000, profit: 19000 },
  { month: "Nov", revenue: 61000, costs: 38000, profit: 23000 },
  { month: "Dec", revenue: 55000, costs: 35000, profit: 20000 },
  { month: "Jan", revenue: 45000, costs: 28000, profit: 17000 },
  { month: "Feb", revenue: 52000, costs: 32000, profit: 20000 },
  { month: "Mar", revenue: 48000, costs: 29000, profit: 19000 },
  { month: "Apr", revenue: 61000, costs: 38000, profit: 23000 },
  { month: "May", revenue: 55000, costs: 35000, profit: 20000 },
  { month: "Jun", revenue: 67000, costs: 42000, profit: 25000 },
];

const FinancialSummaryCard = ({ dateRange }: { dateRange: string }) => {
  const financialData = useMemo(() => {
    const monthsMap = {
      "1month": 1,
      "3months": 3,
      "6months": 6,
      "1year": 12,
    };
    const months = monthsMap[dateRange as keyof typeof monthsMap] || 6;
    return allFinancialData.slice(-months);
  }, [dateRange]);

  const totalRevenue = useMemo(() => financialData.reduce((sum, item) => sum + item.revenue, 0), [financialData]);
  const totalCosts = useMemo(() => financialData.reduce((sum, item) => sum + item.costs, 0), [financialData]);
  const totalProfit = useMemo(() => financialData.reduce((sum, item) => sum + item.profit, 0), [financialData]);
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Financial Summary
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Revenue, costs, and profit analysis
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[hsl(var(--chart-2))]">
              ${totalProfit.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total profit</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-muted/20 p-4 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-lg font-bold text-foreground">${(totalRevenue / 1000).toFixed(0)}K</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-[hsl(var(--chart-2))]" />
              <span className="text-xs text-[hsl(var(--chart-2))]">+12.5%</span>
            </div>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total Costs</p>
            <p className="text-lg font-bold text-foreground">${(totalCosts / 1000).toFixed(0)}K</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-[hsl(var(--chart-5))]" />
              <span className="text-xs text-[hsl(var(--chart-5))]">+8.3%</span>
            </div>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
            <p className="text-lg font-bold text-[hsl(var(--chart-2))]">${(totalProfit / 1000).toFixed(0)}K</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-[hsl(var(--chart-2))]" />
              <span className="text-xs text-[hsl(var(--chart-2))]">+18.2%</span>
            </div>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Profit Margin</p>
            <p className="text-lg font-bold text-foreground">{profitMargin}%</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-[hsl(var(--chart-2))]" />
              <span className="text-xs text-[hsl(var(--chart-2))]">+4.2%</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Revenue vs Costs Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={financialData}>
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
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="costs" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} name="Costs" />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                name="Profit"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryCard;
