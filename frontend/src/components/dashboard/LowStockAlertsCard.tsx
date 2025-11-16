import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

// This type matches your 'LowStockAlert' schema
type LowStockItem = {
  id: number;
  name: string;
  currentStock: number;
  reorderPoint: number;
};

const LowStockAlertsCard = () => {
  const { toast } = useToast();
  
  // --- 1. CHANGE STATE TO HOLD THE FULL ITEM ---
  // We need the ID and quantities, not just the name
  const [itemToReorder, setItemToReorder] = useState<LowStockItem | null>(null);
  const [alerts, setAlerts] = useState<LowStockItem[]>([]);

  // Fetch the low stock alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/dashboard/low-stock-alerts"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stock alerts");
        }
        const data: LowStockItem[] = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    fetchAlerts();
  }, []); // Run once on page load

  // --- 2. MAKE THE REORDER FUNCTION ASYNC ---
  const handleReorderConfirm = async () => {
    if (!itemToReorder) return; // Safety check

    // Calculate the quantity to reorder
    const quantityToOrder = itemToReorder.reorderPoint - itemToReorder.currentStock;

    // Build the request body to match our new API endpoint
    const reorderRequest = {
      product_id: itemToReorder.id,
      quantity: quantityToOrder > 0 ? quantityToOrder : itemToReorder.reorderPoint, // Order at least the reorder point
    };

    try {
      // --- 3. CALL THE NEW REORDER ENDPOINT ---
      const response = await fetch("http://127.0.0.1:8000/api/v1/reorders/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": "Bearer YOUR_TOKEN_HERE" // For when security is on
        },
        body: JSON.stringify(reorderRequest),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to create purchase order.");
      }

      // 4. SHOW SUCCESS
      toast({
        title: "Reorder Initiated",
        description: `Purchase order created for ${itemToReorder.name}.`,
      });
      setItemToReorder(null); // Clear the selected item

    } catch (error) {
      console.error("Failed to reorder:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Could not create purchase order.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-card border-border hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Critical Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[250px] overflow-y-auto">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground p-3">
              No low stock items. Great job!
            </p>
          ) : (
            alerts.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-foreground">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Stock:{" "}
                    <span className="text-warning font-semibold">
                      {item.currentStock}
                    </span>{" "}
                    / {item.reorderPoint}
                  </div>
                </div>
                
                {/* --- 5. UPDATE THE MODAL TO USE THE 'itemToReorder' STATE --- */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => setItemToReorder(item)} // <-- Set the full item object
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Reorder
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Reorder</AlertDialogTitle>
                      <AlertDialogDescription>
                        {/* We now check itemToReorder, not selectedItem */}
                        Are you sure you want to place a reorder for{" "}
                        <strong>{itemToReorder?.name}</strong>? This will
                        create a purchase order to replenish stock.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setItemToReorder(null)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleReorderConfirm}>
                        Confirm Reorder
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          )}
        </div>
        <Link
          to="/inventory"
          className="flex items-center justify-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          View All Inventory
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default LowStockAlertsCard;