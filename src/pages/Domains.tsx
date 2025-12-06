import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, CheckCircle, Clock, Trash2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Domain {
  id: number;
  domain: string;
  status: "verified" | "pending" | "failed";
  sslEnabled: boolean;
  addedDate: string;
}

const DOMAINS_STORAGE_KEY = 'webcasus_domains';

// Default domains
const defaultDomains: Domain[] = [
  {
    id: 1,
    domain: "webcasus.com",
    status: "verified",
    sslEnabled: true,
    addedDate: "2024-01-15",
  },
];

const Domains = () => {
  const { toast } = useToast();
  const [domains, setDomains] = useState<Domain[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(DOMAINS_STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultDomains;
      } catch (error) {
        console.error('Failed to parse domains from localStorage', error);
        return defaultDomains;
      }
    }
    return defaultDomains;
  });
  const [newDomain, setNewDomain] = useState("");

  // Save domains to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(DOMAINS_STORAGE_KEY, JSON.stringify(domains));
    } catch (error) {
      console.error('Failed to save domains to localStorage', error);
      toast({
        title: "Error",
        description: "Failed to save domains. Please try again.",
        variant: "destructive",
      });
    }
  }, [domains, toast]);

  const addDomain = () => {
    if (!newDomain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid domain name.",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate domains
    if (domains.some(d => d.domain.toLowerCase() === newDomain.toLowerCase())) {
      toast({
        title: "Domain exists",
        description: "This domain has already been added.",
        variant: "destructive",
      });
      return;
    }

    const domain: Domain = {
      id: Date.now(),
      domain: newDomain.trim(),
      status: "pending",
      sslEnabled: false,
      addedDate: new Date().toISOString().split("T")[0],
    };

    setDomains([...domains, domain]);
    setNewDomain("");
    toast({
      title: "Domain Added",
      description: "Please configure DNS records to verify your domain.",
    });
  };

  const deleteDomain = (id: number) => {
    setDomains(prevDomains => {
      const updated = prevDomains.filter((domain) => domain.id !== id);
      toast({
        title: "Domain removed",
        description: "The domain has been removed from your account.",
      });
      return updated;
    });
  };

  const updateDomain = (id: number, updates: Partial<Domain>) => {
    setDomains(prevDomains => 
      prevDomains.map(domain => 
        domain.id === id ? { ...domain, ...updates } : domain
      )
    );
  };

  const verifyDomain = (id: number) => {
    // Simulate domain verification
    updateDomain(id, { status: "verified" });
    toast({
      title: "Domain verified",
      description: "Your domain has been successfully verified.",
    });
  };

  const toggleSSL = (id: number, currentStatus: boolean) => {
    // Simulate SSL toggle
    updateDomain(id, { sslEnabled: !currentStatus });
    toast({
      title: `SSL ${!currentStatus ? 'enabled' : 'disabled'}`,
      description: `SSL has been ${!currentStatus ? 'enabled' : 'disabled'} for this domain.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-foreground" />;
      case "pending":
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
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
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Custom Domains</h2>
            <p className="text-muted-foreground">Connect your own domain to your WebCasus websites</p>
          </div>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Add Custom Domain</CardTitle>
              <CardDescription className="text-muted-foreground">
                Connect your own domain to your WebCasus website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="domain" className="text-foreground">Domain Name</Label>
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addDomain} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Domain
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">DNS Configuration</CardTitle>
              <CardDescription className="text-muted-foreground">
                Add these records to your domain's DNS settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="dns-records">
                  <AccordionTrigger className="text-foreground">
                    View DNS Instructions
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-xs sm:text-sm">
                      <div className="bg-background p-4 rounded-lg border border-border overflow-x-auto">
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 font-semibold mb-2 text-foreground min-w-[400px]">
                          <span>Type</span>
                          <span>Name</span>
                          <span>Value</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-muted-foreground min-w-[400px]">
                          <span>A</span>
                          <span>@</span>
                          <span>185.158.133.1</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-muted-foreground mt-2 min-w-[400px]">
                          <span>CNAME</span>
                          <span>www</span>
                          <span>webcasus.com</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        DNS propagation may take up to 24-48 hours. SSL certificates will be
                        automatically provisioned once verification is complete.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-4">
          {domains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index + 2) * 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(domain.status)}
                        <h3 className="font-semibold text-foreground">{domain.domain}</h3>
                        <a
                          href={`https://${domain.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full ${domain.status === "verified"
                              ? "bg-foreground/10 text-foreground"
                              : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {domain.status === "verified" ? "Verified" : "Pending Verification"}
                        </span>
                        {domain.sslEnabled && (
                          <span className="px-2 py-1 rounded-full bg-foreground/10 text-foreground">
                            SSL Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Added on {domain.addedDate}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteDomain(domain.id)}
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

export default Domains;
