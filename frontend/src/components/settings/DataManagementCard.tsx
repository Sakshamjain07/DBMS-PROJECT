import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Download, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DataManagementCard = () => {
  const { toast } = useToast();

  const handleExportData = () => {
    toast({
      title: "Export started",
      description: "Your data export is being prepared. You'll receive a download link shortly.",
    });
  };

  const handleImportData = () => {
    toast({
      title: "Import started",
      description: "Please select a file to import your data.",
    });
  };

  const handleBackup = () => {
    toast({
      title: "Backup created",
      description: "A backup of your data has been created successfully.",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache cleared",
      description: "Application cache has been cleared successfully.",
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Data Management
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Backup, export, and manage your application data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Export Data */}
          <div className="bg-muted/20 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-foreground font-medium">Export Data</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Download all your inventory, orders, and settings data
                </p>
              </div>
              <Button variant="outline" onClick={handleExportData} className="ml-4">
                Export
              </Button>
            </div>
          </div>

          {/* Import Data */}
          <div className="bg-muted/20 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-foreground font-medium">Import Data</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Import data from a CSV or JSON file
                </p>
              </div>
              <Button variant="outline" onClick={handleImportData} className="ml-4">
                Import
              </Button>
            </div>
          </div>

          {/* Backup */}
          <div className="bg-muted/20 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-foreground font-medium">Create Backup</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create a backup of all your data
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last backup: 2 days ago
                </p>
              </div>
              <Button onClick={handleBackup} className="ml-4">
                Backup Now
              </Button>
            </div>
          </div>

          {/* Clear Cache */}
          <div className="bg-muted/20 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-foreground font-medium">Clear Cache</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Clear application cache to free up space
                </p>
              </div>
              <Button variant="outline" onClick={handleClearCache} className="ml-4">
                Clear Cache
              </Button>
            </div>
          </div>

          {/* Auto Backup Settings */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">Automatic Backups</h4>
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Automatic daily backups are enabled
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your data is automatically backed up every day at 2:00 AM. 
                    Backups are retained for 30 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataManagementCard;
