import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  lowStockAlerts: boolean;
  orderUpdates: boolean;
  supplierNotifications: boolean;
  systemUpdates: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

const NotificationSettingsCard = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    lowStockAlerts: true,
    orderUpdates: true,
    supplierNotifications: false,
    systemUpdates: true,
    weeklyReports: true,
    monthlyReports: false,
  });

  const [isDirty, setIsDirty] = useState(false);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setIsDirty(true);
  };

  const handleSave = () => {
    console.log("Notification preferences:", preferences);
    toast({
      title: "Preferences saved",
      description: "Your notification settings have been updated successfully.",
    });
    setIsDirty(false);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notification Preferences
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Notification Channels */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Notification Channels</h4>
            
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications" className="text-foreground cursor-pointer">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={preferences.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="space-y-0.5">
                <Label htmlFor="pushNotifications" className="text-foreground cursor-pointer">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive browser push notifications
                </p>
              </div>
              <Switch
                id="pushNotifications"
                checked={preferences.pushNotifications}
                onCheckedChange={() => handleToggle("pushNotifications")}
              />
            </div>
          </div>

          {/* Notification Types */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Notification Types</h4>
            
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="space-y-0.5">
                <Label htmlFor="lowStockAlerts" className="text-foreground cursor-pointer">
                  Low Stock Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when items are running low
                </p>
              </div>
              <Switch
                id="lowStockAlerts"
                checked={preferences.lowStockAlerts}
                onCheckedChange={() => handleToggle("lowStockAlerts")}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="space-y-0.5">
                <Label htmlFor="orderUpdates" className="text-foreground cursor-pointer">
                  Order Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about order status changes
                </p>
              </div>
              <Switch
                id="orderUpdates"
                checked={preferences.orderUpdates}
                onCheckedChange={() => handleToggle("orderUpdates")}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="space-y-0.5">
                <Label htmlFor="supplierNotifications" className="text-foreground cursor-pointer">
                  Supplier Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates from suppliers
                </p>
              </div>
              <Switch
                id="supplierNotifications"
                checked={preferences.supplierNotifications}
                onCheckedChange={() => handleToggle("supplierNotifications")}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="space-y-0.5">
                <Label htmlFor="systemUpdates" className="text-foreground cursor-pointer">
                  System Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Important system and security updates
                </p>
              </div>
              <Switch
                id="systemUpdates"
                checked={preferences.systemUpdates}
                onCheckedChange={() => handleToggle("systemUpdates")}
              />
            </div>
          </div>

          {/* Report Preferences */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Report Delivery</h4>
            
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="space-y-0.5">
                <Label htmlFor="weeklyReports" className="text-foreground cursor-pointer">
                  Weekly Reports
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly performance summaries
                </p>
              </div>
              <Switch
                id="weeklyReports"
                checked={preferences.weeklyReports}
                onCheckedChange={() => handleToggle("weeklyReports")}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="space-y-0.5">
                <Label htmlFor="monthlyReports" className="text-foreground cursor-pointer">
                  Monthly Reports
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive monthly analytics reports
                </p>
              </div>
              <Switch
                id="monthlyReports"
                checked={preferences.monthlyReports}
                onCheckedChange={() => handleToggle("monthlyReports")}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={!isDirty} className="gap-2">
              <Save className="h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsCard;
