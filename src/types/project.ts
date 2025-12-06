export interface Project {
  id: number;
  name: string;
  status: 'Published' | 'Draft';
  updated: string;
  thumbnail: string;
  description?: string;
}

export const initialProjects: Project[] = [
  {
    id: 1,
    name: "Tech Startup Landing",
    status: "Published",
    updated: "2 hours ago",
    thumbnail: "bg-secondary",
    description: "A modern landing page for tech startups with a clean design."
  },
  {
    id: 2,
    name: "E-commerce Store",
    status: "Draft",
    updated: "1 day ago",
    thumbnail: "bg-muted",
    description: "A fully responsive e-commerce website with product listings and cart functionality."
  },
  {
    id: 3,
    name: "Portfolio Site",
    status: "Published",
    updated: "3 days ago",
    thumbnail: "bg-secondary",
    description: "A personal portfolio website to showcase your work and skills."
  },
  {
    id: 4,
    name: "Restaurant Website",
    status: "Draft",
    updated: "5 days ago",
    thumbnail: "bg-muted",
    description: "An elegant website for restaurants with menu, reservations, and gallery."
  },
];
