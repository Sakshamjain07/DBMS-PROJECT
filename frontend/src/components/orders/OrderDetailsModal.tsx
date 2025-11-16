import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type OrderProduct = {
  name: string;
  quantity: number;
  unitPrice: number;
};

type OrderDetails = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  products: OrderProduct[];
  total: number;
};

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderDetails | null;
  onOrderUpdate: () => void;
}

export function OrderDetailsModal({ open, onOpenChange, order, onOrderUpdate }: OrderDetailsModalProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState(order?.status || "Pending");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (!order) return null;

  const handleSaveChanges = async () => {
    const orderId = order.id.replace("#ORD-", "");
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status })
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast({
        title: "Order Updated",
        description: `Order ${order.id} status changed to ${status}.`,
      });
      onOpenChange(false);
      onOrderUpdate(); 

    } catch (error) {
      console.error("Failed to save status:", error);
      toast({
        title: "Error",
        description: "Could not update order status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "text-yellow-400";
      case "Shipped": return "text-blue-400";
      case "Delivered": return "text-green-500";
      case "Canceled": return "text-red-500";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Order Details: {order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer & Shipping Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Customer & Shipping Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Customer Name</Label>
                <p className="font-medium text-foreground">{order.customer}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Contact Email</Label>
                <p className="font-medium text-foreground">{order.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Phone Number</Label>
                <p className="font-medium text-foreground">{order.phone}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Shipping Address</Label>
                <p className="font-medium text-foreground">{order.address}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Order Summary
            </h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-center">{product.quantity}</TableCell>
                      <TableCell className="text-right">₹{product.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{(product.quantity * product.unitPrice).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="text-2xl font-bold text-foreground">
              ₹{order.total.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="status-select" className="text-sm">
                Update Status:
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status-select" className={cn("w-[140px]", getStatusColor(status))}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending" className="text-yellow-400">Pending</SelectItem>
                  <SelectItem value="Shipped" className="text-blue-400">Shipped</SelectItem>
                  {/* --- THIS WAS THE TYPO --- */}
                  <SelectItem value="Delivered" className="text-green-500">Delivered</SelectItem>
                  <SelectItem value="Canceled" className="text-red-500">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}