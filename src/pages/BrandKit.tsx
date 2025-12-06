import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Sparkles, RefreshCw, Copy, Check, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const industries = [
  "Technology",
  "E-commerce",
  "Healthcare",
  "Education",
  "Finance",
  "Marketing",
  "Real Estate",
  "Food & Beverage",
  "Fashion",
  "Creative Agency",
];

const styles = [
  "Modern & Minimalist",
  "Bold & Vibrant",
  "Corporate & Professional",
  "Elegant & Luxury",
  "Playful & Creative",
];

const BrandKit = () => {
    // Use a custom hook to handle local storage state
  const useLocalStorage = (key: string, initialValue: any) => {
    const [storedValue, setStoredValue] = useState(() => {
      try {
        if (typeof window === 'undefined') return initialValue;
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return initialValue;
      }
    });

    const setValue = (value: any) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    };

    return [storedValue, setValue];
  };

  const [formData, setFormData] = useLocalStorage('brandKitFormData', {
    brandName: "",
    industry: "",
    style: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Generate dynamic colors based on style
  const [colorPalette, setColorPalette] = useLocalStorage('brandKitColorPalette', [
    { name: "Primary", hex: "#6366F1", rgb: "rgb(99, 102, 241)" },
    { name: "Secondary", hex: "#8B5CF6", rgb: "rgb(139, 92, 246)" },
    { name: "Accent", hex: "#EC4899", rgb: "rgb(236, 72, 153)" },
    { name: "Background", hex: "#F9FAFB", rgb: "rgb(249, 250, 251)" },
    { name: "Text", hex: "#1F2937", rgb: "rgb(31, 41, 55)" },
  ]);

  const [logoVariations, setLogoVariations] = useLocalStorage('brandKitLogoVariations', [
    { id: 1, text: formData.brandName.substring(0, 2).toUpperCase() || "BN", style: formData.style.split(' ')[0] || "Modern" },
    { id: 2, text: formData.brandName.substring(0, 2).toUpperCase() || "BN", style: formData.style.split(' ')[0] || "Minimal" },
    { id: 3, text: formData.brandName.substring(0, 2).toUpperCase() || "BN", style: formData.style.split(' ')[0] || "Bold" },
  ]);

  const [fontPairings, setFontPairings] = useLocalStorage('brandKitFontPairings', [
    { heading: "Inter Bold", body: "Inter Regular", preview: "Aa" },
    { heading: "Poppins SemiBold", body: "Poppins Regular", preview: "Aa" },
  ]);

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Update logo variations with new brand name or style if those fields changed
    if (field === 'brandName' || field === 'style') {
      const newLogoText = field === 'brandName' ? value.substring(0, 2).toUpperCase() : formData.brandName.substring(0, 2).toUpperCase() || "BN";
      const newStyle = field === 'style' ? value.split(' ')[0] : formData.style.split(' ')[0] || "Modern";
      
      setLogoVariations(prev => 
        prev.map((logo, idx) => ({
          ...logo,
          text: newLogoText,
          style: ["Modern", "Minimal", "Bold"][idx] || newStyle
        }))
      );
    }
  };

  // Effect to update logo variations when form data changes
  useEffect(() => {
    const logoText = formData.brandName ? formData.brandName.substring(0, 2).toUpperCase() : "BN";
    const logoStyle = formData.style ? formData.style.split(' ')[0] : "Modern";
    
    setLogoVariations(prev => 
      prev.map((logo, idx) => ({
        ...logo,
        text: logoText,
        style: ["Modern", "Minimal", "Bold"][idx] || logoStyle
      }))
    );
  }, [formData.brandName, formData.style]);

  const handleGenerate = async () => {
    if (!formData.brandName || !formData.industry || !formData.style) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setHasGenerated(true);
          generateBrandAssets();
          toast.success("Brand kit generated successfully!");
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const generateBrandAssets = () => {
    // Generate colors based on INDUSTRY
    const industryColorSchemes: Record<string, any[]> = {
      "Technology": [
        { name: "Primary", hex: "#3B82F6", rgb: "rgb(59, 130, 246)" },
        { name: "Secondary", hex: "#6366F1", rgb: "rgb(99, 102, 241)" },
        { name: "Accent", hex: "#8B5CF6", rgb: "rgb(139, 92, 246)" },
        { name: "Background", hex: "#F8FAFC", rgb: "rgb(248, 250, 252)" },
        { name: "Text", hex: "#0F172A", rgb: "rgb(15, 23, 42)" },
      ],
      "E-commerce": [
        { name: "Primary", hex: "#10B981", rgb: "rgb(16, 185, 129)" },
        { name: "Secondary", hex: "#F59E0B", rgb: "rgb(245, 158, 11)" },
        { name: "Accent", hex: "#EC4899", rgb: "rgb(236, 72, 153)" },
        { name: "Background", hex: "#FFFFFF", rgb: "rgb(255, 255, 255)" },
        { name: "Text", hex: "#1F2937", rgb: "rgb(31, 41, 55)" },
      ],
      "Healthcare": [
        { name: "Primary", hex: "#0891B2", rgb: "rgb(8, 145, 178)" },
        { name: "Secondary", hex: "#06B6D4", rgb: "rgb(6, 182, 212)" },
        { name: "Accent", hex: "#14B8A6", rgb: "rgb(20, 184, 166)" },
        { name: "Background", hex: "#F0FDFA", rgb: "rgb(240, 253, 250)" },
        { name: "Text", hex: "#134E4A", rgb: "rgb(19, 78, 74)" },
      ],
      "Education": [
        { name: "Primary", hex: "#7C3AED", rgb: "rgb(124, 58, 237)" },
        { name: "Secondary", hex: "#8B5CF6", rgb: "rgb(139, 92, 246)" },
        { name: "Accent", hex: "#A78BFA", rgb: "rgb(167, 139, 250)" },
        { name: "Background", hex: "#FAF5FF", rgb: "rgb(250, 245, 255)" },
        { name: "Text", hex: "#4C1D95", rgb: "rgb(76, 29, 149)" },
      ],
      "Finance": [
        { name: "Primary", hex: "#1E40AF", rgb: "rgb(30, 64, 175)" },
        { name: "Secondary", hex: "#1E3A8A", rgb: "rgb(30, 58, 138)" },
        { name: "Accent", hex: "#0EA5E9", rgb: "rgb(14, 165, 233)" },
        { name: "Background", hex: "#EFF6FF", rgb: "rgb(239, 246, 255)" },
        { name: "Text", hex: "#1E3A8A", rgb: "rgb(30, 58, 138)" },
      ],
      "Marketing": [
        { name: "Primary", hex: "#EC4899", rgb: "rgb(236, 72, 153)" },
        { name: "Secondary", hex: "#F43F5E", rgb: "rgb(244, 63, 94)" },
        { name: "Accent", hex: "#FB923C", rgb: "rgb(251, 146, 60)" },
        { name: "Background", hex: "#FFF1F2", rgb: "rgb(255, 241, 242)" },
        { name: "Text", hex: "#881337", rgb: "rgb(136, 19, 55)" },
      ],
      "Real Estate": [
        { name: "Primary", hex: "#059669", rgb: "rgb(5, 150, 105)" },
        { name: "Secondary", hex: "#D97706", rgb: "rgb(217, 119, 6)" },
        { name: "Accent", hex: "#78716C", rgb: "rgb(120, 113, 108)" },
        { name: "Background", hex: "#FAFAF9", rgb: "rgb(250, 250, 249)" },
        { name: "Text", hex: "#1C1917", rgb: "rgb(28, 25, 23)" },
      ],
      "Food & Beverage": [
        { name: "Primary", hex: "#DC2626", rgb: "rgb(220, 38, 38)" },
        { name: "Secondary", hex: "#F59E0B", rgb: "rgb(245, 158, 11)" },
        { name: "Accent", hex: "#84CC16", rgb: "rgb(132, 204, 22)" },
        { name: "Background", hex: "#FFFBEB", rgb: "rgb(255, 251, 235)" },
        { name: "Text", hex: "#78350F", rgb: "rgb(120, 53, 15)" },
      ],
      "Fashion": [
        { name: "Primary", hex: "#000000", rgb: "rgb(0, 0, 0)" },
        { name: "Secondary", hex: "#E11D48", rgb: "rgb(225, 29, 72)" },
        { name: "Accent", hex: "#D4AF37", rgb: "rgb(212, 175, 55)" },
        { name: "Background", hex: "#FAFAFA", rgb: "rgb(250, 250, 250)" },
        { name: "Text", hex: "#171717", rgb: "rgb(23, 23, 23)" },
      ],
      "Creative Agency": [
        { name: "Primary", hex: "#8B5CF6", rgb: "rgb(139, 92, 246)" },
        { name: "Secondary", hex: "#EC4899", rgb: "rgb(236, 72, 153)" },
        { name: "Accent", hex: "#F59E0B", rgb: "rgb(245, 158, 11)" },
        { name: "Background", hex: "#FAF5FF", rgb: "rgb(250, 245, 255)" },
        { name: "Text", hex: "#581C87", rgb: "rgb(88, 28, 135)" },
      ],
    };

    setColorPalette(industryColorSchemes[formData.industry] || industryColorSchemes["Technology"]);

    // Update logo variations with brand initials
    const initials = formData.brandName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    setLogoVariations([
      { id: 1, text: initials, style: "Modern" },
      { id: 2, text: initials, style: "Minimal" },
      { id: 3, text: initials, style: "Bold" },
    ]);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    toast.success(`${type} copied to clipboard!`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">AI Brand Kit</h2>
          <p className="text-muted-foreground">Generate logos, colors, and typography for your brand with AI</p>
        </div>

        <AnimatePresence mode="wait">
          {!hasGenerated ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-8 items-stretch"
            >
              {/* Left Column: Form */}
              <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-primary/10 shadow-2xl h-full flex flex-col">
                <div className="space-y-6 flex-1">
                  <div className="flex items-center gap-3 text-primary">
                    <Palette className="h-6 w-6" />
                    <h3 className="font-semibold text-xl">Brand Information</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="brandName">Brand Name</Label>
                      <Input
                        id="brandName"
                        placeholder="e.g. Acme Corporation"
                        value={formData.brandName}
                        onChange={(e) => handleInputChange("brandName", e.target.value)}
                        className="bg-background/50 border-primary/20 focus:border-primary transition-colors h-12"
                      />
                    </div>

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
                      <Label>Brand Style</Label>
                      <div className="grid grid-cols-1 gap-3">
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
                    className="w-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 mt-auto"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Generating {generationProgress}%...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        <span>Generate Brand Kit</span>
                      </div>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Right Column: Preview/Info */}
              <div className="h-full">
                {isGenerating ? (
                  <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/10 h-full flex flex-col justify-center">
                    <div className="space-y-6 text-center">
                      <div className="relative w-32 h-32 mx-auto">
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
                            className="text-primary stroke-current transition-all duration-300"
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
                          <span className="text-2xl font-bold">{generationProgress}%</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold animate-pulse">Creating your brand identity...</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Generating logos, colors, and typography
                        </p>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-primary/5 via-background/30 to-primary/5 border border-border/20 h-full flex flex-col shadow-lg">
                    <div className="space-y-6 sm:space-y-8">
                      <div className="text-center px-2">
                        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-1 sm:mb-2">
                          AI Brand Generator
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium">Preview your brand identity</p>
                      </div>
                      
                      <div className="bg-background/80 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-border/30 backdrop-blur-sm mx-2 sm:mx-0">
                        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                          {/* Logo Preview */}
                          <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl bg-gradient-to-br from-primary/5 via-background/30 to-primary/10 border border-border/20 flex items-center justify-center p-4 sm:p-6 shadow-inner">
                            <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                              {formData.brandName 
                                ? formData.brandName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3) 
                                : 'LOGO'}
                            </div>
                          </div>
                          
                          {/* Brand Info */}
                          <div className="w-full text-center space-y-1 sm:space-y-2">
                            <h4 className="text-xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                              {formData.brandName || 'Your Brand'}
                            </h4>
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                              {formData.industry || 'Your Industry'}
                            </p>
                          </div>
                          
                          {/* Color Palette */}
                          <div className="w-full space-y-2 sm:space-y-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-center text-muted-foreground tracking-wider uppercase">Color Palette</h4>
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                              {['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'].map((color, i) => (
                                <div 
                                  key={i}
                                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-full cursor-pointer hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md flex-shrink-0"
                                  style={{ 
                                    backgroundColor: color,
                                    boxShadow: `0 0 12px ${color}40`
                                  }}
                                  onClick={() => copyToClipboard(color, 'Color')}
                                  title={`Click to copy ${color}`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          {/* Style Selector */}
                          <div className="w-full pt-2 sm:pt-4">
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                              {['Modern', 'Minimal', 'Bold'].map((style) => (
                                <Button 
                                  key={style}
                                  variant="outline" 
                                  size="xs"
                                  className="text-xs sm:text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-background/80 hover:border-primary/30 transition-all h-8 sm:h-9 px-3"
                                >
                                  {style}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center px-2">
                        <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">
                          Your brand kit will include 3 unique logo variations,
                          complete color palettes, and font pairings.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      brandName: formData.brandName, // Keep the brand name
                      industry: formData.industry,   // Keep the industry
                      style: formData.style          // Keep the style
                    });
                    setHasGenerated(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate New
                </Button>
                <Button
                  onClick={async () => {
                    const loadingToast = toast.loading("Preparing your brand assets...");
                    try {
                      const zip = new JSZip();
                      const brandName = formData.brandName.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').toLowerCase() || 'brand';
                      
                      // Create a folder for assets
                      const assetsFolder = zip.folder('brand-assets');
                      
                      if (!assetsFolder) {
                        throw new Error('Failed to create assets folder');
                      }

                      // Add color palette
                      try {
                        const colorPaletteContent = colorPalette
                          .map(color => `${color.name}: ${color.hex} (${color.rgb})`)
                          .join('\n');
                        assetsFolder.file('color-palette.txt', colorPaletteContent);
                      } catch (colorError) {
                        console.error('Error adding colors to zip:', colorError);
                        throw new Error('Failed to add color palette to download');
                      }

                      // Add typography
                      try {
                        const typographyContent = fontPairings
                          .map((pairing, i) => `Font Pairing ${i + 1}:\nHeading: ${pairing.heading}\nBody: ${pairing.body}`)
                          .join('\n\n');
                        assetsFolder.file('typography.txt', typographyContent);
                      } catch (typographyError) {
                        console.error('Error adding typography to zip:', typographyError);
                        throw new Error('Failed to add typography to download');
                      }

                      // Add a simple HTML preview
                      try {
                        const previewContent = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>${formData.brandName || 'Brand'} - Preview</title>
                          <style>
                            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
                            h1 { color: ${colorPalette[0]?.hex || '#000'}; }
                            .color-swatch { display: inline-block; width: 50px; height: 50px; margin: 5px; border: 1px solid #ddd; }
                          </style>
                        </head>
                        <body>
                          <h1>${formData.brandName || 'Your Brand'}</h1>
                          <h2>Color Palette</h2>
                          <div>
                            ${colorPalette.map(color => 
                              `<div style="display: inline-block; margin: 10px; text-align: center;">
                                <div class="color-swatch" style="background-color: ${color.hex}"></div>
                                <div>${color.name}</div>
                                <div>${color.hex}</div>
                              </div>`
                            ).join('')}
                          </div>
                          <h2>Typography</h2>
                          ${fontPairings.map((pairing, i) => `
                            <div style="margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
                              <h3 style="font-family: '${pairing.heading.split(' ')[0]}', sans-serif; margin-top: 0;">
                                ${pairing.heading}
                              </h3>
                              <p style="font-family: '${pairing.body.split(' ')[0]}', sans-serif;">
                                The quick brown fox jumps over the lazy dog.
                              </p>
                            </div>
                          `).join('')}
                        </body>
                        </html>`;
                        
                        assetsFolder.file('preview.html', previewContent);
                      } catch (previewError) {
                        console.error('Error creating preview:', previewError);
                        // Don't fail the whole download if preview fails
                      }

                      // Generate the zip file
                      try {
                        const content = await zip.generateAsync({
                          type: 'blob',
                          compression: 'DEFLATE',
                          compressionOptions: { level: 6 }
                        });
                        
                        saveAs(content, `${brandName}-brand-kit-${new Date().toISOString().split('T')[0]}.zip`);
                        toast.dismiss(loadingToast);
                        toast.success('Brand kit downloaded successfully!');
                      } catch (error) {
                        console.error('Error generating zip file:', error);
                        throw new Error('Failed to create the download file');
                      }
                    } catch (error) {
                      console.error('Error in download process:', error);
                      toast.dismiss(loadingToast);
                      toast.error(error.message || 'Failed to download brand kit. Please try again.');
                    }
                  }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="h-4 w-4" />
                  Download All
                </Button>
              </div>
              
              {/* Logo Concepts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Logo Concepts</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      AI-generated logo variations for your brand
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {logoVariations.map((logo) => (
                        <div
                          key={logo.id}
                          className="group aspect-square bg-background border-2 border-border rounded-xl flex flex-col items-center justify-center hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                        >
                          <div className="text-6xl md:text-7xl font-bold text-primary">
                            {logo.text}
                          </div>
                          <span className="text-xs text-muted-foreground mt-4">{logo.style} Style</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Color Palette */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Color Palette</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Your brand's color scheme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {colorPalette.map((color) => (
                        <div key={color.name} className="space-y-3">
                          <div
                            className="h-32 rounded-xl border-2 border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden"
                            style={{ backgroundColor: color.hex }}
                          >
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => copyToClipboard(color.hex, color.name)}
                              >
                                {copiedColor === color.hex ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-sm text-foreground">{color.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{color.hex}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Font Pairings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Typography</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Recommended font pairings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fontPairings.map((pairing, i) => (
                      <div
                        key={i}
                        className="p-6 border border-border rounded-xl bg-background/50 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-6xl font-bold text-foreground">{pairing.preview}</div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              const content = `Font Pairing ${i + 1}:
  
Heading: ${pairing.heading}
Body: ${pairing.body}

Generated by WebCasus Brand Kit Generator`;
                              
                              const blob = new Blob([content], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${formData.brandName.replace(/\s+/g, '-').toLowerCase()}-typography-${i + 1}.txt`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                              
                              toast.success('Typography downloaded!');
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-foreground">{pairing.heading}</div>
                          <div className="text-sm text-muted-foreground">{pairing.body}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default BrandKit;
