import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, AlertCircle, ShoppingCart } from "lucide-react";

// --- 1. DEFINE THE TYPE OF THE 'kpis' PROP ---
// This must match the type in index.tsx
type KpiData = {
  revenue_today: number;
  orders_today: number;
  pending_orders: number;
  low_stock_items: number;
};

// Define the component's props
interface KeyMetricsCardProps {
  kpis: KpiData;
}

// --- 2. ACCEPT THE 'kpis' PROP ---
const KeyMetricsCard = ({ kpis }: KeyMetricsCardProps) => {
  
  // --- 3. REBUILD THE 'metrics' ARRAY USING THE LIVE 'kpis' DATA ---
  const metrics = [
    { 
      label: "Revenue (Today)", 
      // Format the number as Indian Rupees
      value: `₹${kpis.revenue_today.toLocaleString('en-IN')}`, 
      icon: TrendingUp, 
      color: "text-green-500" 
    },
    { 
      label: "Orders (Today)", 
      value: kpis.orders_today, 
      icon: Package, 
      color: "text-blue-500" 
    },
    { 
      label: "Pending Orders (Needs Action)", 
      value: kpis.pending_orders, 
      icon: ShoppingCart, 
      color: "text-purple-500" 
    },
    { 
      label: "Low Stock Items (Needs Action)", 
      value: kpis.low_stock_items, 
      icon: AlertCircle, 
      color: "text-orange-500", 
      link: "/inventory?filter=low-stock" 
    },
  ];

  return (
    <Card className="bg-card border-border hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-foreground">Today's Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        {/* --- 4. THIS JSX IS UNCHANGED --- */}
        {/* It will now automatically use the dynamic 'metrics' array */}
        <div className="grid grid-cols-2 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const content = (
              <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <Icon className={`h-6 w-6 ${metric.color}`} />
                <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            );

            return metric.link ? (
              <Link key={metric.label} to={metric.link} className="hover:scale-105 transition-transform">
                {content}
              </Link>
            ) : (
              <div key={metric.label}>{content}</div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyMetricsCard;