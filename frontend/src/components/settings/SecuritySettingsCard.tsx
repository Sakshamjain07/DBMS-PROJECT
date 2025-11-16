import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Key, Smartphone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChangePasswordModal } from "@/components/profile/ChangePasswordModal";

const SecuritySettingsCard = () => {
  const { toast } = useToast();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
      description: twoFactorEnabled
        ? "Two-factor authentication has been disabled."
        : "Two-factor authentication has been enabled for your account.",
    });
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your account security and authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Password Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold text-foreground">Password</h4>
              </div>
              <div className="bg-muted/20 border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground font-medium">Change Password</p>
                    <p className="text-sm text-muted-foreground">
                      Last changed 3 months ago
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold text-foreground">Two-Factor Authentication</h4>
              </div>
              <div className="bg-muted/20 border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      Enable Two-Factor Authentication
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={handleTwoFactorToggle}
                  />
                </div>
                {twoFactorEnabled && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-[hsl(var(--chart-2))]">
                      ✓ Two-factor authentication is active
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Sessions */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Active Sessions</h4>
              <div className="space-y-2">
                <div className="bg-muted/20 border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        Chrome on Windows • San Francisco, CA
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Active now</p>
                    </div>
                    <div className="px-2 py-1 bg-[hsl(var(--chart-2))]/20 text-[hsl(var(--chart-2))] text-xs rounded">
                      Active
                    </div>
                  </div>
                </div>

                <div className="bg-muted/20 border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground font-medium">Mobile Device</p>
                      <p className="text-sm text-muted-foreground">
                        Safari on iPhone • San Francisco, CA
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold text-destructive">Danger Zone</h4>
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />
    </>
  );
};

export default SecuritySettingsCard;
