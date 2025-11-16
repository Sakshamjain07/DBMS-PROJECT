import { useState, useEffect } from "react"; // <-- 1. IMPORT HOOKS
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, Clock } from "lucide-react"; // <-- 2. IMPORT MORE ICONS
import { useToast } from "@/hooks/use-toast"; // <-- 3. IMPORT useToast

// --- 4. DEFINE THE TYPE FOR OUR NEW DATA ---
// This matches your 'PriorityTask' schema
type PriorityTask = {
  type: string; // "Pending Orders", "Low Stock", "Late Shipment"
  description: string;
  link_to: string; // e.g., "/orders"
};

const PriorityTasksCard = () => {
  const { toast } = useToast();

  // --- 5. CREATE STATE FOR THE TASK LIST ---
  const [tasks, setTasks] = useState<PriorityTask[]>([]);

  // --- 6. FETCH THE DATA FROM THE BACKEND ---
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/dashboard/priority-tasks"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch priority tasks");
        }
        const data: PriorityTask[] = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        // Optional: Show a toast on error
        // toast({
        //   title: "Error",
        //   description: "Could not load priority tasks.",
        //   variant: "destructive",
        // });
      }
    };

    fetchTasks();
  }, [toast]); // Run once on page load

  // --- 7. DELETE THE HARD-CODED 'tasks' ARRAY ---
  // const tasks = [ ... ]; // <-- This is gone

  // --- 8. HELPER FUNCTION to get the right icon and text ---
  const getTaskDetails = (task: PriorityTask) => {
    switch (task.type) {
      case "Pending Orders":
        return {
          icon: Clock,
          color: "text-yellow-500",
          buttonText: "Review Orders",
        };
      case "Low Stock":
        return {
          icon: AlertTriangle,
          color: "text-red-500",
          buttonText: "View Item",
        };
      case "Late Shipment":
        return {
          icon: Package,
          color: "text-blue-500",
          buttonText: "Contact Supplier",
        };
      default:
        return {
          icon: AlertTriangle,
          color: "text-gray-500",
          buttonText: "View",
        };
    }
  };

  return (
    <Card className="bg-card border-border hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-foreground">Priority Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {/* --- 9. RENDER THE LIVE DATA --- */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground p-3">
              No priority tasks right now.
            </p>
          ) : (
            tasks.map((task, index) => {
              const { icon: Icon, color, buttonText } = getTaskDetails(task);

              return (
                <div
                  key={index} // Using index is okay here as the list is small
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
                >
                  <Icon className={`h-5 w-5 ${color} flex-shrink-0`} />
                  <p className="text-sm text-foreground flex-1">
                    {task.description}
                  </p>
                  <Link to={task.link_to}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-shrink-0"
                    >
                      {buttonText}
                    </Button>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityTasksCard;