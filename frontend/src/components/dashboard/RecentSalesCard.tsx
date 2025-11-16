import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RecentSalesCard = () => {
  const recentSales = [
    { product: "Premium Hoodie", quantity: 2, channel: "Amazon", time: "2 minutes ago" },
    { product: "Classic White Tee", quantity: 5, channel: "Website", time: "8 minutes ago" },
    { product: "Leather Wallet", quantity: 1, channel: "Flipkart", time: "15 minutes ago" },
    { product: "Running Shoes Elite", quantity: 3, channel: "Amazon", time: "23 minutes ago" },
    { product: "Designer Sunglasses", quantity: 1, channel: "Website", time: "31 minutes ago" },
  ];

  const getChannelColor = (channel: string) => {
    const colors: Record<string, string> = {
      Amazon: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      Website: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      Flipkart: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    };
    return colors[channel] || "bg-gray-500/20 text-gray-300";
  };

  return (
    <Card className="bg-card border-border hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Sales Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[250px] overflow-y-auto">
          {recentSales.map((sale, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium text-foreground">{sale.product}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">Qty: {sale.quantity}</span>
                  <Badge className={`text-xs ${getChannelColor(sale.channel)}`}>
                    {sale.channel}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {sale.time}
              </div>
            </div>
          ))}
        </div>
        <Link 
          to="/orders" 
          className="flex items-center justify-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          View All Orders
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default RecentSalesCard;
