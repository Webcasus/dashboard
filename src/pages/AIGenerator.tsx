
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, CheckCircle2, LayoutTemplate, Palette, Type, Globe, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const industries = [
  "Technology",
  "E-commerce",
  "Healthcare",
  "Education",
  "Finance",
  "Marketing",
  "Real Estate",
  "Food & Beverage",
  "Portfolio",
  "Blog",
];

const goals = [
  "Generate leads",
  "Sell products",
  "Share information",
  "Build community",
  "Showcase portfolio",
  "Schedule appointments",
];

const styles = [
  "Modern & Minimalist",
  "Bold & Vibrant",
  "Corporate & Professional",
  "Elegant & Luxury",
  "Playful & Creative",
];

const AIGenerator = () => {
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    goal: "",
    style: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.businessName || !formData.industry || !formData.goal || !formData.style) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsGenerating(true);
    setStep(2);

    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setShowPreview(true);
          toast.success("Website generated successfully!");
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const generationSteps = [
    { label: "Analyzing requirements", progress: 10 },
    { label: "Generating structure", progress: 30 },
    { label: "Writing content", progress: 50 },
    { label: "Designing layout", progress: 70 },
    { label: "Optimizing assets", progress: 90 },
    { label: "Finalizing", progress: 100 },
  ];

  const currentGenerationStep = generationSteps.find(s => generationProgress <= s.progress)?.label || "Completed";

  return (
    <DashboardLayout>
      <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">AI Website Generator</h2>
          <p className="text-muted-foreground">Transform your ideas into a fully functional website in seconds with our advanced AI engine.</p>
        </div>

        <AnimatePresence mode="wait">
          {!showPreview ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-8 items-stretch"
            >
              {/* Left Column: Form */}
              <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-primary/10 shadow-2xl h-full flex flex-col">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                      <LayoutTemplate className="h-5 w-5" />
                      <h3 className="font-semibold text-lg text-foreground">Project Details</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business / Project Name</Label>
                      <Input
                        id="businessName"
                        placeholder="e.g. Nexus Tech Solutions"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        className="bg-background/50 border-primary/20 focus:border-primary transition-colors h-12"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Industry</Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(val) => handleInputChange("industry", val)}
                        >
                          <SelectTrigger className="bg-background/50 border-primary/20 h-12">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((ind) => (
                              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Primary Goal</Label>
                        <Select
                          value={formData.goal}
                          onValueChange={(val) => handleInputChange("goal", val)}
                        >
                          <SelectTrigger className="bg-background/50 border-primary/20 h-12">
                            <SelectValue placeholder="Select goal" />
                          </SelectTrigger>
                          <SelectContent>
                            {goals.map((g) => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3 text-primary">
                      <Palette className="h-5 w-5" />
                      <h3 className="font-semibold text-lg text-foreground">Design Preferences</h3>
                    </div>

                    <div className="space-y-2">
                      <Label>Visual Style</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {styles.map((style) => (
                          <div
                            key={style}
                            onClick={() => handleInputChange("style", style)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${formData.style === style
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background/50 hover:border-primary/50"
                              }`}
                          >
                            <span className="text-sm font-medium">{style}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    className="w-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 mt-4"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating Magic...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        <span>Generate Website</span>
                      </div>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Right Column: Progress / Info */}
              <div className="h-full">
                {isGenerating ? (
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/10 h-full flex flex-col justify-between">
                    <div className="space-y-6">
                      {/* Progress Circle */}
                      <div className="relative w-24 h-24 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-muted stroke-current"
                            strokeWidth="8"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                          />
                          <circle
                            className="text-primary stroke-current transition-all duration-300 ease-out"
                            strokeWidth="8"
                            strokeLinecap="round"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            strokeDasharray={`${generationProgress * 2.51} 251.2`}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold">{generationProgress}%</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-center">
                        <h3 className="text-lg font-semibold animate-pulse">
                          {currentGenerationStep}...
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Building your {formData.industry} website
                        </p>
                      </div>

                      {/* Live Website Preview During Generation */}
                      <div className="border border-border rounded-lg overflow-hidden shadow-lg bg-background">
                        {/* Browser Header */}
                        <div className="bg-muted/50 border-b border-border p-2 flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
                          </div>
                          <div className="flex-1 bg-background/50 rounded h-5 flex items-center px-2">
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {formData.businessName.toLowerCase().replace(/\s+/g, '-')}.webcasus.site
                            </span>
                          </div>
                        </div>

                        {/* Preview Content - Animated Building */}
                        <div className="aspect-[4/3] bg-background p-3 overflow-hidden relative">
                          {/* Header Preview */}
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: generationProgress > 20 ? 1 : 0, y: 0 }}
                            className="flex justify-between items-center mb-2 pb-2 border-b border-border/30"
                          >
                            <div className="h-3 w-16 bg-primary/30 rounded" />
                            <div className="flex gap-1.5">
                              <div className="h-2 w-10 bg-muted/50 rounded" />
                              <div className="h-2 w-10 bg-muted/50 rounded" />
                              <div className="h-2 w-10 bg-muted/50 rounded" />
                            </div>
                          </motion.div>

                          {/* Hero Section Preview */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: generationProgress > 40 ? 1 : 0, y: 0 }}
                            className="text-center space-y-2 mb-3"
                          >
                            <div className="h-5 w-3/4 mx-auto bg-gradient-to-r from-primary/40 to-primary/20 rounded animate-pulse" />
                            <div className="h-3 w-2/3 mx-auto bg-muted/40 rounded" />
                            <div className="flex gap-1.5 justify-center mt-2">
                              <div className="h-5 w-14 bg-primary/40 rounded" />
                              <div className="h-5 w-14 bg-muted/30 rounded" />
                            </div>
                          </motion.div>

                          {/* Features Grid Preview */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: generationProgress > 60 ? 1 : 0 }}
                            className="grid grid-cols-3 gap-1.5"
                          >
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                  scale: generationProgress > (60 + i * 10) ? 1 : 0.8,
                                  opacity: generationProgress > (60 + i * 10) ? 1 : 0
                                }}
                                className="p-2 rounded bg-muted/20 border border-border/30"
                              >
                                <div className="h-5 w-5 bg-primary/20 rounded mb-1" />
                                <div className="h-1.5 w-full bg-muted/30 rounded mb-0.5" />
                                <div className="h-1.5 w-3/4 bg-muted/20 rounded" />
                              </motion.div>
                            ))}
                          </motion.div>

                          {/* Loading Overlay */}
                          {generationProgress < 100 && (
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {generationSteps.map((s, i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-colors duration-500 ${generationProgress >= s.progress ? "bg-primary" : "bg-muted"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/10 h-full min-h-[400px] flex flex-col">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">Preview Example</h3>
                        <p className="text-sm text-muted-foreground">See what your AI-generated website will look like</p>
                      </div>

                      {/* Static Preview Before Generation */}
                      <div className="border border-border rounded-lg overflow-hidden shadow-lg bg-background">
                        {/* Browser Header */}
                        <div className="bg-muted/50 border-b border-border p-2 flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
                          </div>
                          <div className="flex-1 bg-background/50 rounded h-5 flex items-center px-2">
                            <span className="text-[10px] text-muted-foreground font-mono">your-business.webcasus.site</span>
                          </div>
                        </div>

                        {/* Preview Content - Static */}
                        <div className="aspect-[4/3] bg-background p-3 overflow-hidden">
                          {/* Header Preview */}
                          <div className="flex justify-between items-center mb-2 pb-2 border-b border-border/30">
                            <div className="h-3 w-16 bg-primary/30 rounded" />
                            <div className="flex gap-1.5">
                              <div className="h-2 w-10 bg-muted/50 rounded" />
                              <div className="h-2 w-10 bg-muted/50 rounded" />
                              <div className="h-2 w-10 bg-muted/50 rounded" />
                            </div>
                          </div>

                          {/* Hero Section Preview */}
                          <div className="text-center space-y-2 mb-3">
                            <div className="h-5 w-3/4 mx-auto bg-gradient-to-r from-primary/40 to-primary/20 rounded" />
                            <div className="h-3 w-2/3 mx-auto bg-muted/40 rounded" />
                            <div className="flex gap-1.5 justify-center mt-2">
                              <div className="h-5 w-14 bg-primary/40 rounded" />
                              <div className="h-5 w-14 bg-muted/30 rounded" />
                            </div>
                          </div>

                          {/* Features Grid Preview */}
                          <div className="grid grid-cols-3 gap-1.5">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="p-2 rounded bg-muted/20 border border-border/30">
                                <div className="h-5 w-5 bg-primary/20 rounded mb-1" />
                                <div className="h-1.5 w-full bg-muted/30 rounded mb-0.5" />
                                <div className="h-1.5 w-3/4 bg-muted/20 rounded" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        ✨ Fill in the form and click "Generate Website" to create yours
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{formData.businessName}</h3>
                  <p className="text-muted-foreground">Generated based on {formData.style} style</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1 md:flex-none">
                    Back to Editor
                  </Button>
                  <Button 
                    className="flex-1 md:flex-none bg-primary text-primary-foreground"
                    onClick={() => setShowPublishDialog(true)}
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : isPublished ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Published!
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-4 w-4" />
                        Publish Website
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="border border-border rounded-xl overflow-hidden shadow-2xl bg-background">
                {/* Browser Mockup Header */}
                <div className="bg-muted/50 border-b border-border p-4 flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <div className="flex-1 bg-background/50 rounded-md h-8 flex items-center px-4 text-xs text-muted-foreground font-mono">
                    https://{formData.businessName.toLowerCase().replace(/\s+/g, '-')}.webcasus.site
                  </div>
                </div>

                {/* Website Preview Content - Scrollable with Multiple Sections */}
                <div className="relative h-[600px] bg-background overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  <div className="min-h-full">
                    {/* Header Navigation */}
                    <header className="sticky top-0 z-10 p-6 flex justify-between items-center border-b border-border/10 bg-background/95 backdrop-blur-sm">
                      <span className="font-bold text-xl">{formData.businessName}</span>
                      <nav className="hidden md:flex gap-6 text-sm font-medium">
                        <span className="cursor-pointer hover:text-primary transition-colors">Home</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">About</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">Services</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">Contact</span>
                      </nav>
                      <Button size="sm">Get Started</Button>
                    </header>

                    {/* Hero Section */}
                    <section className="p-12 md:p-20 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
                      <div className="text-center space-y-6 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                          Transforming {formData.industry} for the Future
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                          We help you {formData.goal.toLowerCase()} with our innovative solutions designed for modern businesses.
                        </p>
                        <div className="flex gap-4 justify-center pt-4">
                          <Button size="lg" className="text-base px-8">Start Now</Button>
                          <Button size="lg" variant="outline" className="text-base px-8">Learn More</Button>
                        </div>
                      </div>
                    </section>

                    {/* About Section */}
                    <section className="p-12 md:p-16 bg-muted/20">
                      <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Us</h2>
                          <p className="text-muted-foreground max-w-2xl mx-auto">
                            Leading the way in {formData.industry.toLowerCase()} with cutting-edge solutions
                          </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                          <div className="aspect-video bg-primary/10 rounded-lg border border-border/50 flex items-center justify-center">
                            <div className="text-6xl opacity-20">📊</div>
                          </div>
                          <div className="space-y-4">
                            <div className="h-4 w-full bg-muted/70 rounded" />
                            <div className="h-4 w-5/6 bg-muted/50 rounded" />
                            <div className="h-4 w-4/6 bg-muted/30 rounded" />
                            <div className="h-4 w-full bg-muted/70 rounded mt-6" />
                            <div className="h-4 w-3/4 bg-muted/50 rounded" />
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Services/Features Section */}
                    <section className="p-12 md:p-16">
                      <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
                          <p className="text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive solutions tailored to your {formData.industry.toLowerCase()} needs
                          </p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 mb-4 flex items-center justify-center">
                                <div className="w-6 h-6 bg-primary/30 rounded" />
                              </div>
                              <div className="h-5 w-3/4 bg-muted rounded mb-3" />
                              <div className="space-y-2">
                                <div className="h-3 w-full bg-muted/50 rounded" />
                                <div className="h-3 w-5/6 bg-muted/40 rounded" />
                                <div className="h-3 w-4/6 bg-muted/30 rounded" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Contact Section */}
                    <section className="p-12 md:p-16 bg-muted/20">
                      <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                          Ready to start your journey? Contact us today
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
                          <div className="p-4 bg-background rounded-lg border border-border">
                            <div className="h-10 bg-muted/30 rounded mb-2" />
                          </div>
                          <div className="p-4 bg-background rounded-lg border border-border">
                            <div className="h-10 bg-muted/30 rounded mb-2" />
                          </div>
                          <div className="md:col-span-2 p-4 bg-background rounded-lg border border-border">
                            <div className="h-24 bg-muted/30 rounded mb-2" />
                          </div>
                        </div>
                        <Button size="lg" className="mt-6 px-12">Send Message</Button>
                      </div>
                    </section>

                    {/* Footer */}
                    <footer className="p-8 bg-muted/30 border-t border-border/50">
                      <div className="max-w-6xl mx-auto">
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i}>
                              <div className="h-4 w-24 bg-muted rounded mb-3" />
                              <div className="space-y-2">
                                <div className="h-3 w-20 bg-muted/50 rounded" />
                                <div className="h-3 w-16 bg-muted/40 rounded" />
                                <div className="h-3 w-20 bg-muted/50 rounded" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="pt-6 border-t border-border/30 text-center">
                          <p className="text-sm text-muted-foreground">
                            © 2024 {formData.businessName}. All rights reserved.
                          </p>
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>

              {/* Publish Confirmation Dialog */}
              <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Publish Website</DialogTitle>
                    <DialogDescription className="space-y-4">
                      <p>Are you sure you want to publish this website? Once published, it will be live at:</p>
                      <div className="p-3 bg-muted/50 rounded-md font-mono text-sm break-all">
                        https://{formData.businessName.toLowerCase().replace(/\s+/g, '-')}.webcasus.site
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You can always update or unpublish your website later from the dashboard.
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPublishDialog(false)}
                      disabled={isPublishing}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={async () => {
                        try {
                          setIsPublishing(true);
                          // Simulate API call
                          await new Promise(resolve => setTimeout(resolve, 1500));
                          
                          // In a real app, you would call your API endpoint here
                          // await publishWebsite({
                          //   name: formData.businessName,
                          //   style: formData.style,
                          //   // ... other data
                          // });
                          
                          setIsPublished(true);
                          toast.success('Website published successfully!');
                          setShowPublishDialog(false);
                        } catch (error) {
                          toast.error('Failed to publish website. Please try again.');
                          console.error('Publish error:', error);
                        } finally {
                          setIsPublishing(false);
                        }
                      }}
                      disabled={isPublishing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isPublishing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {isPublishing ? 'Publishing...' : 'Publish Now'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default AIGenerator;
