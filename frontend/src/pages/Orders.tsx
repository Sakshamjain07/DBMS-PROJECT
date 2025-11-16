import { useState, useEffect } from "react"; // <-- 1. IMPORT useEffect
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, ArrowUpDown, ArrowUp, ArrowDown, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";
import { cn } from "@/lib/utils"; // <-- 2. IMPORT 'cn' UTILITY

// 3. DELETE THE 'mockOrders' ARRAY
// const mockOrders = [ ... ];

// 4. DEFINE THE NEW 'Order' TYPE (to match your backend)
type Order = {
  id: number;
  customer_name: string;
  order_date: string; // This will be a "2025-11-08T10:00:00" string
  total: number;
  status: string;
};

type SortField = "id" | "customer" | "date" | "total" | "status";
type SortDirection = "asc" | "desc";

type OrderDetailsType = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  products: { name: string; quantity: number; unitPrice: number; }[];
  total: number;
};

type BackendOrderDetailItem = {
  quantity: number;
  price_at_sale: number;
  product: {
    name: string;
  };
};

type BackendOrderDetails = {
  id: number;
  customer_name: string;
  order_date: string;
  status: string;
  total: number;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items: BackendOrderDetailItem[];
};

const Orders = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]); // Keep as string for keys
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetailsType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 8;

  // 5. ADD NEW STATE FOR LIVE DATA
  const [orders, setOrders] = useState<Order[]>([]);

  // 6. ADD useEffect TO FETCH DATA
  const fetchOrders = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/orders");
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    const data = await response.json();
    setOrders(data);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    toast({
      title: "Error",
      description: "Could not fetch orders from the server.",
      variant: "destructive",
    });
  }
};

useEffect(() => {
  fetchOrders();
}, [toast]); 

  // This function is your new fixed version
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Pending":
        return { className: "bg-warning text-yellow-300" };
      case "Shipped":
        return { className: "bg-chart-1 hover:bg-chart-1 text-primary-foreground" };
      case "Delivered":
        return { className: "bg-success text-green-300" };
      case "Canceled":
        return { className: "bg-destructive hover:bg-destructive text-destructive-foreground" };
      default:
        return { className: "" };
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  // 7. UPDATE FILTER/SORT TO USE 'orders' STATE
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      String(order.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "id":
        comparison = a.id - b.id;
        break;
      case "customer":
        comparison = a.customer_name.localeCompare(b.customer_name);
        break;
      case "date":
        comparison = new Date(a.order_date).getTime() - new Date(b.order_date).getTime();
        break;
      case "total":
        comparison = a.total - b.total;
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(paginatedOrders.map(o => String(o.id)));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedOrders.length} order(s).`,
    });
    setSelectedOrders([]);
  };

  // 8. UPDATE 'handleViewDetails' (for now, use placeholders)
  const handleViewDetails = async (order: Order) => {
  // 1. Open the modal immediately with "Loading..." placeholders
  setSelectedOrder({
    id: `#ORD-${order.id}`,
    customer: order.customer_name,
    email: "Loading...", // <-- Will show "Loading..."
    phone: "Loading...",
    address: "Loading...",
    status: order.status,
    products: [], // Empty for now
    total: order.total,
  });
  setIsModalOpen(true);

  try {
    // 2. Fetch the full details from the new endpoint
    const response = await fetch(`http://127.0.0.1:8000/api/v1/orders/${order.id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch order details");
    }
    const fullDetails: BackendOrderDetails = await response.json();

    // 3. Update the modal with the complete, real data
    setSelectedOrder({
      id: `#ORD-${fullDetails.id}`,
      customer: fullDetails.customer_name,
      email: fullDetails.customer_email,
      phone: fullDetails.customer_phone,
      address: fullDetails.customer_address,
      status: fullDetails.status,
      // Translate backend 'items' to frontend 'products'
      products: fullDetails.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.price_at_sale
      })),
      total: fullDetails.total,
    });

  } catch (error) {
    console.error("Failed to fetch details:", error);
    toast({
      title: "Error",
      description: "Could not load order details.",
      variant: "destructive",
    });
    // Close the modal if the fetch fails
    setIsModalOpen(false); 
  }
};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <h2 className="text-3xl font-bold text-foreground mb-6">Order Management</h2>

          {/* Control Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID or Customer Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
            {selectedOrders.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreVertical className="h-4 w-4 mr-2" />
                    Bulk Actions ({selectedOrders.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBulkAction("Changed status to Shipped")}>
                    Mark as Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("Changed status to Delivered")}>
                    Mark as Delivered
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("Printed invoices for")}>
                    Print Invoices
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("Canceled")} className="text-destructive">
                    Cancel Orders
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Orders Table */}
          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center">
                      Order ID
                      <SortIcon field="id" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("customer")}
                  >
                    <div className="flex items-center">
                      Customer Name
                      <SortIcon field="customer" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center">
                      Date
                      <SortIcon field="date" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center">
                      Total Amount
                      <SortIcon field="total" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      <SortIcon field="status" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              {/* 9. UPDATE TABLE BODY TO USE LIVE DATA */}
              <TableBody>
                {paginatedOrders.map((order) => {
                  const statusStyle = getStatusVariant(order.status);
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedOrders.includes(String(order.id))}
                          onCheckedChange={(checked) => handleSelectOrder(String(order.id), checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">#ORD-{order.id}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                      <TableCell>₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={cn(statusStyle.className, "transition-all duration-200")}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, sortedOrders.length)} of{" "}
              {sortedOrders.length} orders
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </main>
      </div>

      <OrderDetailsModal 
    open={isModalOpen}
    onOpenChange={setIsModalOpen}
    order={selectedOrder}
    onOrderUpdate={fetchOrders} // <-- ADD THIS LINE
  />
    </div>
  );
};

export default Orders;