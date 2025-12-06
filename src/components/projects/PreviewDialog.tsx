import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface PreviewDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewDialog({ project, isOpen, onClose }: PreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className={`aspect-video ${project.thumbnail} rounded-lg flex items-center justify-center`}>
            <p className="text-foreground font-semibold text-xl">{project.name}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Status</h3>
                <p className="text-muted-foreground capitalize">{project.status.toLowerCase()}</p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-medium">Last Updated</h3>
                <p className="text-muted-foreground">{project.updated}</p>
              </div>
            </div>
            
            {project.description && (
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            )}
            
            <div className="pt-4 flex justify-end">
              <Button>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Editor
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
