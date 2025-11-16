import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
// 1. useEffect is imported
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Filter, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, MoreVertical, Shirt, Footprints, Watch, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  supplier: string;
};

type SortField = "name" | "sku" | "category" | "currentStock" | "reorderPoint" | "supplier";
type SortDirection = "asc" | "desc";

const Inventory = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const itemsPerPage = 10;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // --- NEW --- (State for the "Add Product" modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newCategory, setNewCategory] = useState("Apparel");
  const [newSupplier, setNewSupplier] = useState("");
  const [newStock, setNewStock] = useState(0);
  const [newReorder, setNewReorder] = useState(10);
  // --- END NEW ---

  // FETCH DATA FROM BACKEND (GET Request)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({
          title: "Error fetching products",
          description: "Could not load data from the server.",
          variant: "destructive",
        });
      }
    };
    fetchProducts();
  }, []); // The empty array [] means this runs ONCE on component mount


  // --- NEW --- (Function to save a new product - POST Request)
const handleFormSubmit = async () => {
    if (productToEdit) {
      // --- WE ARE IN "EDIT" MODE ---
      const updatedProductData = {
        name: newProductName,
        sku: newSku,
        category: newCategory,
        supplier: newSupplier,
        currentStock: newStock,
        reorderPoint: newReorder,
      };

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/products/${productToEdit.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProductData),
        });

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        const updatedProduct = await response.json();

        // Update the 'products' state by replacing the old item
        setProducts(
          products.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        
        toast({ title: "Product Updated", description: `${updatedProduct.name} has been updated.` });
        setIsModalOpen(false); // Close modal on success

      } catch (error) {
        toast({ title: "Error", description: "Could not update product.", variant: "destructive" });
      }

    } else {
      // --- WE ARE IN "ADD NEW" MODE ---
      // (This is your existing handleSaveProduct logic)
      const newProductData = {
        name: newProductName,
        sku: newSku,
        category: newCategory,
        supplier: newSupplier,
        currentStock: newStock,
        reorderPoint: newReorder,
      };

      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProductData),
        });

        if (!response.ok) {
          throw new Error("Failed to create product");
        }

        const savedProduct = await response.json();
        setProducts([...products, savedProduct]); // Add new product to state
        toast({ title: "Product Added", description: `${savedProduct.name} has been added.` });
        setIsModalOpen(false); // Close modal on success

      } catch (error) {
        toast({ title: "Error", description: "Could not create product.", variant: "destructive" });
      }
    }
  };
  // --- END NEW ---


  // --- (All your helper functions: getProductIcon, getStockStatus, etc.) ---
  // Helper to get product icon based on category
  const getProductIcon = (category: string) => {
    switch (category) {
      case "Apparel": return Shirt;
      case "Footwear": return Footprints;
      case "Accessories": return Watch;
      default: return Package;
    }
  };

  const getStockStatus = (current: number, reorder: number) => {
    if (current === 0) return "out";
    if (current <= reorder) return "low"; // FIX: This now catches all low stock
    return "good";
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case "out": return "text-destructive";
      case "low": return "text-destructive";
      case "good": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  // This is your new function
  const getStockBadge = (current: number, reorder: number) => {
    const status = getStockStatus(current, reorder);
    const percentage = (current / reorder) * 100;
    
    return (
      <div className="flex items-center gap-2 group">
        <span className={cn(
          "font-semibold transition-all duration-300",
          getStockColor(status),
          (status === "out" || status === "low") && "animate-pulse" // This is fine
        )}>
          {current}
        </span>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden w-20 relative">
          <div 
            className={cn(
              "h-full transition-all duration-700 ease-out relative overflow-hidden",
              // --- THIS IS THE FIX ---
              (status === "out" || status === "low") ? "bg-gradient-to-r from-destructive via-orange-500 to-destructive" :
              "bg-gradient-to-r from-success via-green-400 to-success"
              // --- END OF FIX ---
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    );
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
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 transition-transform duration-200" />;
    return sortDirection === "asc" ? 
      <ArrowUp className="ml-2 h-4 w-4 transition-transform duration-300 animate-in fade-in-0 slide-in-from-bottom-1" /> : 
      <ArrowDown className="ml-2 h-4 w-4 transition-transform duration-300 animate-in fade-in-0 slide-in-from-top-1" />;
  };

  // USE THE 'products' STATE HERE
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const status = getStockStatus(product.currentStock, product.reorderPoint);
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "in-stock" && status === "good") ||
                         (filterStatus === "low-stock" && (status === "low" || status === "medium")) ||
                         (filterStatus === "out-of-stock" && status === "out");
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "sku":
        comparison = a.sku.localeCompare(b.sku);
        break;
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
      case "currentStock":
        comparison = a.currentStock - b.currentStock;
        break;
      case "reorderPoint":
        comparison = a.reorderPoint - b.reorderPoint;
        break;
      case "supplier":
        comparison = a.supplier.localeCompare(b.supplier);
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(paginatedProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

 const handleDelete = async (productToDelete: Product) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/products/${productToDelete.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product.");
    }

    // 1. Update the frontend state to remove the product
    setProducts(products.filter(p => p.id !== productToDelete.id));

    // 2. Show a success toast
    toast({
      title: "Product Deleted",
      description: `${productToDelete.name} has been removed.`,
    });

  } catch (error) {
    console.error("Failed to delete product:", error);
    toast({
      title: "Error deleting product",
      description: "Could not delete the product from the server.",
      variant: "destructive",
    });
  }
};

  const handleEdit = (product: Product) => {
    // 1. Set the product to edit
    setProductToEdit(product);
    
    // 2. Pre-fill the form state with this product's data
    setNewProductName(product.name);
    setNewSku(product.sku);
    setNewCategory(product.category);
    setNewSupplier(product.supplier);
    setNewStock(product.currentStock);
    setNewReorder(product.reorderPoint);
    
    // 3. Open the modal
    setIsModalOpen(true);
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedProducts.length} product(s).`,
    });
    setSelectedProducts([]);
    // TODO: Add API call for bulk action
  };
  
  // --- (Your JSX starts here) ---
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          {/* Control Bar */}
          <div className="mb-6 space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Inventory Management</h2>
            
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[300px] max-w-md relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
                <Input
                  placeholder="Search by Product Name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:shadow-lg focus:shadow-primary/10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px] bg-card border-border">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px] bg-card border-border">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Apparel">Apparel</SelectItem>
                    <SelectItem value="Footwear">Footwear</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>

                {/* --- NEW --- (This whole Dialog is updated to use state) */}
                <Dialog open={isModalOpen} onOpenChange={(isOpen) => {setIsModalOpen(isOpen);
                // If we're closing the modal, reset everything
                if (!isOpen) {
                setProductToEdit(null);
                setNewProductName("");
                setNewSku("");
                setNewCategory("Apparel");
                setNewSupplier("");
                setNewStock(0);
                setNewReorder(10);
      }
    }}
  >
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>
                        {productToEdit ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                      <DialogDescription>
                        Enter the details for the new product. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="product-name">Product Name</Label>
                        <Input
                          id="product-name"
                          placeholder="e.g., Premium T-Shirt"
                          value={newProductName}
                          onChange={(e) => setNewProductName(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          placeholder="e.g., PTS-BLK-M"
                          value={newSku}
                          onChange={(e) => setNewSku(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Select value={newCategory} onValueChange={setNewCategory}>
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Apparel">Apparel</SelectItem>
                              <SelectItem value="Footwear">Footwear</SelectItem>
                              <SelectItem value="Accessories">Accessories</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="supplier">Supplier</Label>
                          <Input
                            id="supplier"
                            placeholder="Supplier name"
                            value={newSupplier}
                            onChange={(e) => setNewSupplier(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="stock">Current Stock</Label>
                          <Input
                            id="stock"
                            type="number"
                            placeholder="0"
                            value={newStock}
                            onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="reorder">Reorder Point</Label>
                          <Input
                            id="reorder"
                            type="number"
                            placeholder="0"
                            value={newReorder}
                            onChange={(e) => setNewReorder(parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleFormSubmit}>
                        Save Product
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* --- END NEW --- */}


                {selectedProducts.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <MoreVertical className="h-4 w-4 mr-2" />
                        Bulk Actions ({selectedProducts.length})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleBulkAction("Stock updated for")}>
                        Update Stock Levels
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction("Exported")}>
                        Export Selected
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction("Moved to archive")}>
                        Archive Products
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction("Deleted")} className="text-destructive">
                        Delete Selected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden shadow-xl animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="transition-all duration-200 data-[state=checked]:scale-110"
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50 transition-all duration-200"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Product
                      <SortIcon field="name" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50 transition-all duration-200"
                    onClick={() => handleSort("sku")}
                  >
                    <div className="flex items-center">
                      SKU
                      <SortIcon field="sku" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50 transition-all duration-200"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      <SortIcon field="category" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50 transition-all duration-200"
                    onClick={() => handleSort("currentStock")}
                  >
                    <div className="flex items-center">
                      Current Stock
                      <SortIcon field="currentStock" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50 transition-all duration-200"
                    onClick={() => handleSort("reorderPoint")}
                  >
                    <div className="flex items-center">
                      Reorder Point
                      <SortIcon field="reorderPoint" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50 transition-all duration-200"
                    onClick={() => handleSort("supplier")}
                  >
                    <div className="flex items-center">
                      Supplier
                      <SortIcon field="supplier" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product, index) => {
                  const ProductIcon = getProductIcon(product.category);
                  const status = getStockStatus(product.currentStock, product.reorderPoint);
                  
                  return (
                    <TableRow 
                      key={product.id} 
                      className={cn(
                        "border-border transition-all duration-300 hover:bg-muted/50 hover:scale-[1.01] hover:shadow-lg cursor-pointer group",
                        "animate-in fade-in-0 slide-in-from-bottom-2",
                        (status === "out" || status === "low") && "bg-destructive/5"
                      )}
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: "backwards"
                      }}
                    >
                      <TableCell>
                        <Checkbox 
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                          className="transition-all duration-200 data-[state=checked]:scale-110"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-md flex items-center justify-center border border-border relative overflow-hidden group-hover:scale-110 group-hover:shadow-lg transition-all duration-300",
                            "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"
                          )}>
                            <ProductIcon className="h-5 w-5 text-primary transition-all duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                          </div>
                          <span className="font-medium transition-colors duration-200 group-hover:text-primary">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                        {product.sku}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="bg-muted/30 transition-all duration-300 hover:bg-muted hover:scale-105 hover:shadow-md"
                        >
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStockBadge(product.currentStock, product.reorderPoint)}
                      </TableCell>
                      <TableCell className="text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                        {product.reorderPoint}
                      </TableCell>
                      <TableCell className="text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                        {product.supplier}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                            className="transition-all duration-200 hover:scale-110 hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-destructive/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-300">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete <strong>{product.name}</strong>? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="transition-all duration-200 hover:scale-105">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-destructive/30"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
            <p className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} items
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="transition-all duration-200 hover:scale-105 hover:shadow-md disabled:hover:scale-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-9 transition-all duration-200 hover:scale-110 hover:shadow-md",
                        currentPage === pageNum && "shadow-lg shadow-primary/30"
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="transition-all duration-200 hover:scale-105 hover:shadow-md disabled:hover:scale-100"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inventory;