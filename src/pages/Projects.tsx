import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { Project, initialProjects } from "@/types/project";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteConfirmation } from "@/components/projects/DeleteConfirmation";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { PreviewDialog } from "@/components/projects/PreviewDialog";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    // Initialize with sample data or from localStorage if available
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : initialProjects;
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Save projects to localStorage whenever they change
  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const handleAddProject = () => {
    setCurrentProject(null);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (projectId: number) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      const updatedProjects = projects.filter(project => project.id !== projectToDelete);
      saveProjects(updatedProjects);
      toast.success('Project deleted successfully');
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleSaveProject = async (projectData: Omit<Project, 'id' | 'updated'>) => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const now = new Date();
    const updatedAt = formatDistanceToNow(now, { addSuffix: true });
    
    if (currentProject) {
      // Update existing project
      const updatedProjects = projects.map(project => 
        project.id === currentProject.id 
          ? { 
              ...project, 
              ...projectData, 
              updated: updatedAt,
              thumbnail: projectData.status === 'Published' ? 'bg-secondary' : 'bg-muted'
            } 
          : project
      );
      saveProjects(updatedProjects);
      toast.success('Project updated successfully');
    } else {
      // Create new project
      const newProject: Project = {
        id: Date.now(),
        ...projectData,
        updated: updatedAt,
        thumbnail: projectData.status === 'Published' ? 'bg-secondary' : 'bg-muted'
      };
      saveProjects([...projects, newProject]);
      toast.success('Project created successfully');
    }
    
    setIsSaving(false);
    setIsFormOpen(false);
  };

  const handlePreview = (project: Project) => {
    setCurrentProject(project);
    setIsPreviewOpen(true);
  };
  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">My Projects</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage and monitor all your websites
            </p>
          </div>
          <Button 
            onClick={handleAddProject}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="overflow-hidden bg-card border-border hover:border-foreground transition-all duration-300 h-full flex flex-col">
                <div className={`aspect-video ${project.thumbnail} flex items-center justify-center`}>
                  <p className="text-foreground font-semibold text-lg">{project.name}</p>
                </div>
                <div className="p-4 space-y-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Updated {project.updated}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          project.status === "Published"
                            ? "bg-foreground/20 text-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    {project.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDeleteClick(project.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Project Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {currentProject ? 'Edit Project' : 'Create New Project'}
              </DialogTitle>
            </DialogHeader>
            <ProjectForm 
              project={currentProject || undefined}
              onSave={handleSaveProject}
              onCancel={() => setIsFormOpen(false)}
              isSaving={isSaving}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmation
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setProjectToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          projectName={
            projects.find(p => p.id === projectToDelete)?.name || 'this project'
          }
        />

        {/* Preview Dialog */}
        {currentProject && (
          <PreviewDialog
            project={currentProject}
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Projects;
