import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Eye, EyeOff, Plus, Trash2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface APIKey {
  id: number;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: "active" | "expired";
}

const APIKeys = () => {
  const { toast } = useToast();
  const [showKey, setShowKey] = useState<{ [key: number]: boolean }>({});
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 1,
      name: "Production API",
      key: "wc_live_sk_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
      created: "2024-01-15",
      lastUsed: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      name: "Development API",
      key: "wc_test_sk_xyz987wvu654tsr321qpo098nml765kji432hgf109edc876ba",
      created: "2024-01-10",
      lastUsed: "1 day ago",
      status: "active",
    },
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const maskKey = (key: string) => {
    return `${key.slice(0, 12)}...${key.slice(-4)}`;
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard.",
    });
  };

  const toggleKeyVisibility = (id: number) => {
    setShowKey({ ...showKey, [id]: !showKey[id] });
  };

  const generateNewKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    setTimeout(() => {
      const newKey: APIKey = {
        id: Date.now(),
        name: newKeyName,
        key: `wc_live_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        created: new Date().toISOString().split("T")[0],
        lastUsed: "Never",
        status: "active",
      };
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName("");
      setIsCreating(false);
      toast({
        title: "API Key Created",
        description: "Your new API key has been generated successfully.",
      });
    }, 1000);
  };

  const deleteKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast({
      title: "API Key Deleted",
      description: "The API key has been removed.",
    });
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">API Key Management</h2>
            <p className="text-muted-foreground">Manage your API keys for integrations and automated access</p>
          </div>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Generate New API Key</CardTitle>
              <CardDescription className="text-muted-foreground">
                Create a new API key for integrations and automated access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="keyName" className="text-foreground">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production API"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={generateNewKey} disabled={isCreating} className="w-full sm:w-auto">
                    {isCreating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Generate Key
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-4">
          {apiKeys.map((apiKey, index) => (
            <motion.div
              key={apiKey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{apiKey.name}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${apiKey.status === "active"
                              ? "bg-foreground/10 text-foreground"
                              : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {apiKey.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs sm:text-sm overflow-x-auto">
                        <code className="text-muted-foreground break-all">
                          {showKey[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {showKey[apiKey.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Created: {apiKey.created}</span>
                        <span>Last used: {apiKey.lastUsed}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default APIKeys;
