// src/pages/index.tsx

import { useState, useEffect } from "react"; // <-- Import hooks
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import KeyMetricsCard from "@/components/dashboard/KeyMetricsCard";
import PriorityTasksCard from "@/components/dashboard/PriorityTasksCard";
import LowStockAlertsCard from "@/components/dashboard/LowStockAlertsCard";
import RecentSalesCard from "@/components/dashboard/RecentSalesCard";
import { useToast } from "@/hooks/use-toast"; // <-- Import useToast

// --- 1. DEFINE THE TYPE FOR OUR NEW DATA ---
type KpiData = {
  revenue_today: number;
  orders_today: number;
  pending_orders: number;
  low_stock_items: number;
};

const Index = () => {
  const { toast } = useToast();
  
  // --- 2. CREATE STATE FOR OUR KPI DATA ---
  const [kpis, setKpis] = useState<KpiData>({
    revenue_today: 0,
    orders_today: 0,
    pending_orders: 0,
    low_stock_items: 0,
  });

  // --- 3. FETCH THE KPI DATA FROM THE BACKEND ---
  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/dashboard/kpis");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard KPIs");
        }
        const data: KpiData = await response.json();
        setKpis(data);
      } catch (error) {
        console.error("Failed to fetch KPIs:", error);
        toast({
          title: "Error",
          description: "Could not load dashboard data.",
          variant: "destructive",
        });
      }
    };

    fetchKpis();
  }, [toast]); // Run once on page load

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* --- 4. PASS THE LIVE DATA AS A PROP --- */}
            <KeyMetricsCard kpis={kpis} />
            
            <PriorityTasksCard />
            <LowStockAlertsCard />
            <RecentSalesCard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;