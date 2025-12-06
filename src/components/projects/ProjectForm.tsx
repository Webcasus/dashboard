import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types/project";

interface ProjectFormProps {
  project?: Project;
  onSave: (project: Omit<Project, 'id' | 'updated'>) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function ProjectForm({ project, onSave, onCancel, isSaving }: ProjectFormProps) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState<'Draft' | 'Published'>(project?.status || 'Draft');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
      setStatus(project.status);
    } else {
      // Reset form for new project
      setName('');
      setDescription('');
      setStatus('Draft');
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      status,
      thumbnail: status === 'Published' ? 'bg-secondary' : 'bg-muted',
      updated: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter project name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter project description"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Status</Label>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              className="form-radio text-primary"
              checked={status === 'Draft'}
              onChange={() => setStatus('Draft')}
            />
            <span>Draft</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              className="form-radio text-primary"
              checked={status === 'Published'}
              onChange={() => setStatus('Published')}
            />
            <span>Published</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
