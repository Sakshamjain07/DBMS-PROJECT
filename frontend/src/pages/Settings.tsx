import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import GeneralSettingsCard from "@/components/settings/GeneralSettingsCard";
import NotificationSettingsCard from "@/components/settings/NotificationSettingsCard";
import SystemPreferencesCard from "@/components/settings/SystemPreferencesCard";
import SecuritySettingsCard from "@/components/settings/SecuritySettingsCard";
import DataManagementCard from "@/components/settings/DataManagementCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <SettingsIcon className="h-8 w-8 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <GeneralSettingsCard />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettingsCard />
            </TabsContent>

            <TabsContent value="system">
              <SystemPreferencesCard />
            </TabsContent>

            <TabsContent value="security">
              <SecuritySettingsCard />
            </TabsContent>

            <TabsContent value="data">
              <DataManagementCard />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
