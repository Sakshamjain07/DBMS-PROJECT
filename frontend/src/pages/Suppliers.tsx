import { useState, useEffect } from "react"; // <-- Make sure useEffect is imported
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
// --- Use Pencil for Edit ---
import { Plus, Search, Filter, Pencil, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// 1. DEFINE THE 'Supplier' TYPE (matches your new backend schema)
type Supplier = {
  id: string; // Keep as string for React keys
  name: string;
  contact_person: string; // <-- Use snake_case
  email: string;
  contact_number: string; // <-- Use snake_case
  category: string;
};

type SortField = "name" | "contact_person" | "email" | "category";
type SortDirection = "asc" | "desc";

const Suppliers = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const itemsPerPage = 10;

  // --- State for the live data ---
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); // <-- Start with empty array

  // --- State for the Add/Edit Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);

  // --- State for the form fields (must match modal) ---
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newContactNumber, setNewContactNumber] = useState("");
  const [newCategory, setNewCategory] = useState("Apparel"); // Default

  // 2. FETCH ALL SUPPLIERS (READ)
  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/suppliers");
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
      toast({
        title: "Error",
        description: "Could not fetch suppliers from the server.",
        variant: "destructive",
      });
    }
  };

  // Run fetchSuppliers once on page load
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // 3. COMBINED 'SAVE' FUNCTION (CREATE / UPDATE)
  const handleFormSubmit = async () => {
    // A. WE ARE IN "EDIT" MODE
    if (supplierToEdit) {
      const updatedSupplierData = { // <-- Use snake_case
        name: newSupplierName,
        contact_person: newContactPerson,
        email: newEmail,
        contact_number: newContactNumber,
        category: newCategory,
      };

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/suppliers/${supplierToEdit.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSupplierData),
        });

        if (!response.ok) {
          throw new Error("Failed to update supplier");
        }
        const updatedSupplier = await response.json();

        // Update the 'suppliers' state by replacing the old item
        setSuppliers(
          suppliers.map(s => (s.id === updatedSupplier.id ? updatedSupplier : s))
        );
        toast({ title: "Supplier Updated", description: `${updatedSupplier.name} has been updated.` });
        setIsModalOpen(false); // Close modal on success

      } catch (error) {
        toast({ title: "Error", description: "Could not update supplier.", variant: "destructive" });
      }

    // B. WE ARE IN "ADD NEW" MODE
    } else {
      const newSupplierData = { // <-- Use snake_case
        name: newSupplierName,
        contact_person: newContactPerson,
        email: newEmail,
        contact_number: newContactNumber,
        category: newCategory,
      };

      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSupplierData),
        });

        if (!response.ok) {
          throw new Error("Failed to create supplier");
        }
        const savedSupplier = await response.json();
        setSuppliers([...suppliers, savedSupplier]); // Add new supplier to state
        toast({ title: "Supplier Added", description: `${savedSupplier.name} has been added.` });
        setIsModalOpen(false); // Close modal on success

      } catch (error) {
        toast({ title: "Error", description: "Could not create supplier.", variant: "destructive" });
      }
    }
  };

  // 4. "DELETE" FUNCTION
  const handleDelete = async (supplierToDelete: Supplier) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/suppliers/${supplierToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete supplier.");
      }
      
      setSuppliers(suppliers.filter(s => s.id !== supplierToDelete.id));
      toast({
        title: "Supplier Deleted",
        description: `${supplierToDelete.name} has been removed.`,
      });

    } catch (error) {
      toast({
        title: "Error deleting supplier",
        description: "Could not delete the supplier from the server.",
        variant: "destructive",
      });
    }
  };

  // 5. "EDIT" BUTTON CLICK HANDLER
  const handleEditClick = (supplier: Supplier) => {
    setSupplierToEdit(supplier);
    setNewSupplierName(supplier.name);
    setNewContactPerson(supplier.contact_person); // <-- Use snake_case
    setNewEmail(supplier.email);
    setNewContactNumber(supplier.contact_number); // <-- Use snake_case
    setNewCategory(supplier.category);
    setIsModalOpen(true);
  };
  
  // 6. MODAL OPEN/CLOSE HANDLER (to reset the form)
  const handleModalOpenChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    if (!isOpen) {
      // If closing, reset everything
      setSupplierToEdit(null);
      setNewSupplierName("");
      setNewContactPerson("");
      setNewEmail("");
      setNewContactNumber("");
      setNewCategory("Apparel");
    }
  };

  // --- Helper functions for sorting/filtering ---
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
    return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) || // <-- Use snake_case
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || supplier.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    const multiplier = sortDirection === "asc" ? 1 : -1;
    return aValue < bValue ? -multiplier : aValue > bValue ? multiplier : 0;
  });

  const totalPages = Math.ceil(sortedSuppliers.length / itemsPerPage);
  const paginatedSuppliers = sortedSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSuppliers(paginatedSuppliers.map(s => s.id));
    } else {
      setSelectedSuppliers([]);
    }
  };

  const handleSelect = (supplierId: string, checked: boolean) => {
    if (checked) {
      setSelectedSuppliers([...selectedSuppliers, supplierId]);
    } else {
      setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplierId));
    }
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedSuppliers.length} suppliers.`,
    });
    setSelectedSuppliers([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <h2 className="text-3xl font-bold text-foreground mb-6">Supplier Management</h2>

          {/* Control Bar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Supplier Name or Contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Apparel">Apparel</SelectItem>
                  <SelectItem value="Footwear">Footwear</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
              
              {/* --- ADD/EDIT MODAL --- */}
              <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
                <DialogTrigger asChild>
                  {/* --- Use onClick for new supplier --- */}
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Supplier
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>
                      {supplierToEdit ? "Edit Supplier" : "Add New Supplier"}
                    </DialogTitle>
                    <DialogDescription>
                      Enter the supplier's details.
                    </DialogDescription>
                  </DialogHeader>
                  {/* --- This form matches your form screenshot --- */}
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="supplier-name">Supplier Name</Label>
                      <Input
                        id="supplier-name"
                        value={newSupplierName}
                        onChange={(e) => setNewSupplierName(e.target.value)}
                        placeholder="e.g., Fashion Forward Ltd."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-person">Contact Person</Label>
                      <Input
                        id="contact-person"
                        value={newContactPerson}
                        onChange={(e) => setNewContactPerson(e.target.value)}
                        placeholder="e.g., Rajesh Kumar"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="e.g., rajesh@fashionforward.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-number">Contact Number</Label>
                      <Input
                        id="contact-number"
                        value={newContactNumber}
                        onChange={(e) => setNewContactNumber(e.target.value)}
                        placeholder="e.g., +91 98765 43210"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={newCategory} onValueChange={setNewCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Apparel">Apparel</SelectItem>
                          <SelectItem value="Footwear">Footwear</SelectItem>
                          <SelectItem value="Accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleFormSubmit}>Save Supplier</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
            </div>
          </div>
          
          {/* Bulk Actions (matches your file) */}
          {selectedSuppliers.length > 0 && (
            <div className="mt-4 mb-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedSuppliers.length} selected
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions
                    <MoreVertical className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => handleBulkAction("Export Selected")}
                  >
                    Export Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBulkAction("Send Email to Selected")}
                  >
                    Send Email to Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBulkAction("Archive Selected")}
                    className="text-destructive"
                  >
                    Archive Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* --- SUPPLIERS TABLE --- */}
          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedSuppliers.length ===
                          paginatedSuppliers.length &&
                        paginatedSuppliers.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Supplier Name
                      {<SortIcon field="name" />}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("contact_person")}
                  >
                    <div className="flex items-center">
                      Contact Person
                      {<SortIcon field="contact_person" />}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      Email Address
                      {<SortIcon field="email" />}
                    </div>
                  </TableHead>
                  <TableHead>
                    Contact Number
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      {<SortIcon field="category" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedSuppliers.includes(supplier.id)}
                        onCheckedChange={(checked) =>
                          handleSelect(supplier.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {supplier.name}
                    </TableCell>
                    <TableCell>{supplier.contact_person}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.contact_number}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{supplier.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(supplier)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <strong>{supplier.name}</strong>? 
                              This will permanently remove them from your records.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(supplier)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, sortedSuppliers.length)} of{" "}
              {sortedSuppliers.length} suppliers
            </p>
            {/* Pagination controls can be added here if needed */}
          </div>
        </main>
      </div>

      {/* Note: Your original file had separate modal components. 
          This version uses shadcn's Dialog directly.
          You can adapt this back to your components if you prefer. */}
    </div>
  );
};

export default Suppliers;