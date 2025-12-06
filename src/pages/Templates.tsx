import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const TEMPLATE_STORAGE_KEY = 'selectedTemplateId';

const Templates = () => {
  const [filter, setFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(() => {
    // Load selected template from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedTemplate = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      return savedTemplate ? Number(savedTemplate) : null;
    }
    return null;
  });

  // Save selected template to localStorage whenever it changes
  useEffect(() => {
    if (selectedTemplate !== null) {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, selectedTemplate.toString());
    } else {
      localStorage.removeItem(TEMPLATE_STORAGE_KEY);
    }
  }, [selectedTemplate]);

  const templates = [
    { id: 1, name: "Business Portfolio", category: "business", image: "/Business Portfolio.png" },
    { id: 2, name: "E-commerce Store", category: "ecommerce", image: "/E-commerce Store.png" },
    { id: 3, name: "Landing Page", category: "marketing", image: "/Landing Page.png" },
    { id: 4, name: "Blog Template", category: "blog", image: "/Blog Template.png" },
    { id: 5, name: "SaaS Dashboard", category: "saas", image: "/SaaS Dashboard.png" },
    { id: 6, name: "Restaurant Menu", category: "restaurant", image: "/Restaurant Menu.png" },
  ];

  const filteredTemplates = filter === "all"
    ? templates
    : templates.filter(t => t.category === filter);

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Template Library</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Choose from our collection of professionally designed templates
            </p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-card border-border overflow-hidden group cursor-pointer">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-background border-b border-border flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={template.image} 
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </div> */}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg text-foreground">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground capitalize mt-1">
                    {template.category}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant={selectedTemplate === template.id ? "default" : "outline"} 
                    className="w-full transition-all duration-200"
                    onClick={() => {
                      if (selectedTemplate === template.id) {
                        setSelectedTemplate(null);
                        toast.info(`Deselected ${template.name} template`);
                      } else {
                        setSelectedTemplate(template.id);
                        toast.success(`${template.name} template selected!`, {
                          description: 'Start customizing your template now.',
                          duration: 3000,
                        });
                      }
                    }}
                  >
                    {selectedTemplate === template.id ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Use Template
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Templates;
