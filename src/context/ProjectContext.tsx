import React, { createContext, useContext, useState, useCallback } from "react";
import { ResearchProject, ExportRecord } from "@/types/research";
import { defaultProject } from "@/data/mockProject";

interface ProjectContextType {
  project: ResearchProject;
  setProject: React.Dispatch<React.SetStateAction<ResearchProject>>;
  resetProject: () => void;
  updateSection: (sectionId: string, content: string) => void;
  toggleChecklist: (itemId: string) => void;
  uploadDataset: () => void;
  addExport: (record: ExportRecord) => void;
  addAnalysisResult: (result: ResearchProject["analysisResults"][0]) => void;
  insertCitation: (sectionId: string, citation: string) => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<ResearchProject>({ ...defaultProject });

  const resetProject = useCallback(() => setProject({ ...defaultProject }), []);

  const updateSection = useCallback((sectionId: string, content: string) => {
    setProject(prev => ({ ...prev, sections: prev.sections.map(s => s.id === sectionId ? { ...s, content } : s), updatedAt: new Date().toISOString().split("T")[0] }));
  }, []);

  const toggleChecklist = useCallback((itemId: string) => {
    setProject(prev => ({ ...prev, checklist: prev.checklist.map(c => c.id === itemId ? { ...c, checked: !c.checked } : c) }));
  }, []);

  const uploadDataset = useCallback(() => {
    setProject(prev => ({ ...prev, dataset: { ...prev.dataset, uploaded: true }, checklist: prev.checklist.map(c => c.id === "cl5" ? { ...c, checked: true } : c) }));
  }, []);

  const addExport = useCallback((record: ExportRecord) => {
    setProject(prev => ({ ...prev, exports: [...prev.exports, record], status: "exported" as const, checklist: prev.checklist.map(c => c.id === "cl7" ? { ...c, checked: true } : c) }));
  }, []);

  const addAnalysisResult = useCallback((result: ResearchProject["analysisResults"][0]) => {
    setProject(prev => ({ ...prev, analysisResults: [...prev.analysisResults, result], checklist: prev.checklist.map(c => c.id === "cl6" ? { ...c, checked: true } : c) }));
  }, []);

  const insertCitation = useCallback((sectionId: string, citation: string) => {
    setProject(prev => ({ ...prev, sections: prev.sections.map(s => s.id === sectionId ? { ...s, content: s.content + " " + citation } : s) }));
  }, []);

  return (
    <ProjectContext.Provider value={{ project, setProject, resetProject, updateSection, toggleChecklist, uploadDataset, addExport, addAnalysisResult, insertCitation }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
};
