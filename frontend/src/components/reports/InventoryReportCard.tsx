import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Package } from "lucide-react";
import { useMemo } from "react";

const baseStockData = [
  { name: "In Stock", value: 1250, color: "hsl(var(--chart-2))" },
  { name: "Low Stock", value: 185, color: "hsl(var(--chart-3))" },
  { name: "Out of Stock", value: 45, color: "hsl(var(--chart-5))" },
];

const turnoverData = [
  { category: "Electronics", rate: 8.5 },
  { category: "Furniture", rate: 4.2 },
  { category: "Clothing", rate: 12.3 },
  { category: "Books", rate: 6.7 },
  { category: "Tools", rate: 5.1 },
];

const InventoryReportCard = ({ dateRange }: { dateRange: string }) => {
  const stockData = useMemo(() => {
    const multiplier = dateRange === "1month" ? 0.3 : dateRange === "3months" ? 0.7 : dateRange === "1year" ? 1.2 : 1;
    return baseStockData.map(item => ({
      ...item,
      value: Math.round(item.value * multiplier)
    }));
  }, [dateRange]);

  const totalItems = useMemo(() => {
    return stockData.reduce((sum, item) => sum + item.value, 0);
  }, [stockData]);
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Inventory Report
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Stock levels and turnover analysis
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{totalItems.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total items</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Stock Status Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stockData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${(entry.percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Turnover Rate by Category</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={turnoverData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="category" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                label={{ value: 'Times/Year', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar dataKey="rate" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-xl font-bold text-foreground">$2.4M</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Item Value</p>
            <p className="text-xl font-bold text-foreground">$1,621</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reorder Needed</p>
            <p className="text-xl font-bold text-[hsl(var(--chart-3))]">45</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryReportCard;
