import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SalesReportCard from "@/components/reports/SalesReportCard";
import InventoryReportCard from "@/components/reports/InventoryReportCard";
import PurchaseReportCard from "@/components/reports/PurchaseReportCard";
import FinancialSummaryCard from "@/components/reports/FinancialSummaryCard";
import TrendAnalysisCard from "@/components/reports/TrendAnalysisCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Download, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const [dateRange, setDateRange] = useState("6months");
  const { toast } = useToast();

  const handleExportPDF = () => {
    toast({
      title: "Exporting to PDF",
      description: "Your report is being generated...",
    });
    // In a real app, this would generate and download a PDF
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your PDF report has been downloaded.",
      });
    }, 1500);
  };

  const handleExportCSV = () => {
    toast({
      title: "Exporting to CSV",
      description: "Your data is being prepared...",
    });
    // In a real app, this would generate and download a CSV
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your CSV file has been downloaded.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
                <p className="text-muted-foreground">
                  Comprehensive insights into sales, inventory, and financial performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
                <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
                  <FileText className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Reports Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SalesReportCard dateRange={dateRange} />
                <InventoryReportCard dateRange={dateRange} />
                <PurchaseReportCard dateRange={dateRange} />
                <FinancialSummaryCard dateRange={dateRange} />
              </div>
              <TrendAnalysisCard dateRange={dateRange} />
            </TabsContent>

            <TabsContent value="sales" className="space-y-6">
              <SalesReportCard dateRange={dateRange} />
              <PurchaseReportCard dateRange={dateRange} />
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <InventoryReportCard dateRange={dateRange} />
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <FinancialSummaryCard dateRange={dateRange} />
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <TrendAnalysisCard dateRange={dateRange} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Reports;
