import React, { createContext, useContext, useState, useCallback } from "react";
import { ResearchProject } from "@/types/research";
import { defaultProject } from "@/data/mockProject";

interface ProjectContextType {
  project: ResearchProject;
  setProject: React.Dispatch<React.SetStateAction<ResearchProject>>;
  resetProject: () => void;
  updateSection: (sectionId: string, content: string) => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<ResearchProject>({ ...defaultProject });

  const resetProject = useCallback(() => {
    setProject({ ...defaultProject });
  }, []);

  const updateSection = useCallback((sectionId: string, content: string) => {
    setProject((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, content } : s
      ),
      updatedAt: new Date().toISOString().split("T")[0],
    }));
  }, []);

  return (
    <ProjectContext.Provider value={{ project, setProject, resetProject, updateSection }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
};
