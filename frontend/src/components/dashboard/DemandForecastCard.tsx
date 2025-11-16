import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from "recharts";
import { Info } from "lucide-react";
import { useState } from "react";

const DemandForecastCard = () => {
  const [selectedProduct, setSelectedProduct] = useState("bestseller");

  const products = [
    { id: "bestseller", name: "Weekend Vibe T-shirt" },
    { id: "premium", name: "Premium Hoodie" },
    { id: "classic", name: "Classic Denim Jeans" },
    { id: "sneakers", name: "Sports Sneakers Pro" },
  ];

  const data = [
    { day: "Day 1", demand: 120 },
    { day: "Day 5", demand: 135 },
    { day: "Day 10", demand: 145 },
    { day: "Day 15", demand: 165 },
    { day: "Day 18", demand: 280 },
    { day: "Day 20", demand: 310 },
    { day: "Day 22", demand: 290 },
    { day: "Day 25", demand: 180 },
    { day: "Day 30", demand: 150 },
  ];

  return (
    <Card className="bg-card border-border hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-foreground">Demand Forecast</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>AI-predicted demand for the next 30 days</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="day" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              label={{ value: "Demand", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <ReferenceLine 
              x="Day 20" 
              stroke="hsl(var(--warning))" 
              strokeDasharray="3 3"
            >
              <Label 
                value="Upcoming Sale Period" 
                position="top" 
                fill="hsl(var(--warning))"
                fontSize={12}
                fontWeight="bold"
              />
            </ReferenceLine>
            <Line 
              type="monotone" 
              dataKey="demand" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DemandForecastCard;
