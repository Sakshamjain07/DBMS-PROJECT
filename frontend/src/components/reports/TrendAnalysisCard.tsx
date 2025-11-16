import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

const allDemandData = [
  { month: "Jul", actual: 145, forecast: 152, lastYear: 138 },
  { month: "Aug", actual: 158, forecast: 165, lastYear: 145 },
  { month: "Sep", actual: 172, forecast: 178, lastYear: 159 },
  { month: "Oct", actual: 165, forecast: 170, lastYear: 162 },
  { month: "Nov", actual: 189, forecast: 195, lastYear: 175 },
  { month: "Dec", actual: null, forecast: 205, lastYear: 192 },
  { month: "Jan", actual: 145, forecast: 152, lastYear: 138 },
  { month: "Feb", actual: 158, forecast: 165, lastYear: 145 },
  { month: "Mar", actual: 172, forecast: 178, lastYear: 159 },
  { month: "Apr", actual: 165, forecast: 170, lastYear: 162 },
  { month: "May", actual: 189, forecast: 195, lastYear: 175 },
  { month: "Jun", actual: null, forecast: 205, lastYear: 192 },
];

const seasonalInsights = [
  { period: "Q4 2024", trend: "Peak Season", confidence: "High", change: "+28%" },
  { period: "Holiday Period", trend: "Increased Demand", confidence: "High", change: "+35%" },
  { period: "Jan-Feb 2025", trend: "Post-Holiday Dip", confidence: "Medium", change: "-15%" },
];

const TrendAnalysisCard = ({ dateRange }: { dateRange: string }) => {
  const demandData = useMemo(() => {
    const monthsMap = {
      "1month": 1,
      "3months": 3,
      "6months": 6,
      "1year": 12,
    };
    const months = monthsMap[dateRange as keyof typeof monthsMap] || 6;
    return allDemandData.slice(-months);
  }, [dateRange]);

  const displayRange = useMemo(() => {
    const rangeMap = {
      "1month": "1-Month",
      "3months": "3-Month",
      "6months": "6-Month",
      "1year": "1-Year",
    };
    return rangeMap[dateRange as keyof typeof rangeMap] || "6-Month";
  }, [dateRange]);
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trend Analysis & Forecasting
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Demand patterns and seasonal predictions
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[hsl(var(--chart-2))]/20 text-[hsl(var(--chart-2))] border-[hsl(var(--chart-2))]/30">
              <Calendar className="h-3 w-3 mr-1" />
              {displayRange} View
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Demand Forecast vs Actual</h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                label={{ value: 'Orders', angle: -90, position: 'insideLeft' }}
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
                wrapperStyle={{ paddingTop: '10px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--chart-1))', r: 5 }}
                name="Actual Orders"
              />
              <Line 
                type="monotone" 
                dataKey="forecast" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--chart-3))', r: 4 }}
                name="Forecasted"
              />
              <Line 
                type="monotone" 
                dataKey="lastYear" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ fill: 'hsl(var(--muted-foreground))', r: 3 }}
                name="Last Year"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Seasonal Insights</h4>
          <div className="space-y-3">
            {seasonalInsights.map((insight, index) => (
              <div 
                key={index}
                className="bg-muted/20 border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">{insight.period}</p>
                    <Badge 
                      variant="outline" 
                      className={
                        insight.confidence === "High" 
                          ? "bg-[hsl(var(--chart-2))]/20 text-[hsl(var(--chart-2))] border-[hsl(var(--chart-2))]/30 text-xs"
                          : "bg-[hsl(var(--chart-3))]/20 text-[hsl(var(--chart-3))] border-[hsl(var(--chart-3))]/30 text-xs"
                      }
                    >
                      {insight.confidence} Confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.trend}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    insight.change.startsWith('+') 
                      ? 'text-[hsl(var(--chart-2))]' 
                      : 'text-[hsl(var(--chart-5))]'
                  }`}>
                    {insight.change}
                  </p>
                  <p className="text-xs text-muted-foreground">Expected change</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">System Insights</p>
              <p className="text-sm text-muted-foreground">
                Based on historical trends, consider increasing inventory by 25% for Q4 2024. 
                Focus on top-performing categories: Electronics (+35%), Clothing (+28%), and Home Goods (+22%).
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysisCard;
