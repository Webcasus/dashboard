import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Settings = () => {
  const { user, isLoaded } = useUser();
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.fullName || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    try {
      await user.update({
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
      });
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      console.error('Failed to update user:', error);
      toast.error(error.errors?.[0]?.longMessage || "Failed to save settings. Please try again.");
    }
  };

  if (!isLoaded) return null;

  return (
    <DashboardLayout>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
              <AvatarFallback className="text-xl">
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold">{user?.fullName || 'User'}</h2>
              <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || 'No email provided'}</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="p-6 bg-card border-border space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    This will be displayed on your profile and in emails.
                  </p>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background border-border focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Your email address is managed via Clerk.
                  </p>
                  <Input
                    id="email"
                    type="email"
                    value={user?.primaryEmailAddress?.emailAddress || ''}
                    disabled
                    className="bg-muted border-border focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="p-6 bg-card border-border space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Marketing Emails</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive tips and updates
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card className="p-6 bg-card border-border space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Current Plan</h3>
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div>
                      <p className="font-semibold">Starter Plan</p>
                      <p className="text-sm text-muted-foreground">$19/month</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => toast.info('Please contact our team to change your plan', {
                        description: 'Our support team will help you with the plan change process.',
                        duration: 5000,
                      })}
                    >
                      Change Plan
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Payment History</h3>
                  <div className="space-y-2">
                    {[
                      { date: "Nov 1, 2024", amount: "$19.00" },
                      { date: "Oct 1, 2024", amount: "$19.00" },
                      { date: "Sep 1, 2024", amount: "$19.00" },
                    ].map((payment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                      >
                        <p className="text-sm">{payment.date}</p>
                        <p className="font-medium">{payment.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
