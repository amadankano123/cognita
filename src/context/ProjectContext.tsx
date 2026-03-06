import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ResearchProject, ExportRecord, SectionMeta, Section } from "@/types/research";
import { defaultProject } from "@/data/mockProject";
import { ProjectType, SECTION_TEMPLATES, templateToSections, mapSectionsToTemplate, TemplateSectionDef } from "@/data/sectionTemplates";

const STORAGE_KEY = "cognita-project-data";

function loadSavedProject(): ResearchProject {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as ResearchProject;
    }
  } catch (e) {
    console.warn("Failed to load saved project data:", e);
  }
  return { ...defaultProject };
}

function saveProjectToStorage(project: ResearchProject) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch (e) {
    console.warn("Failed to save project data:", e);
  }
}

interface ProjectContextType {
  project: ResearchProject;
  setProject: React.Dispatch<React.SetStateAction<ResearchProject>>;
  resetProject: () => void;
  updateSection: (sectionId: string, content: string) => void;
  toggleChecklist: (itemId: string) => void;
  uploadDataset: () => void;
  addExport: (record: ExportRecord) => void;
  addAnalysisResult: (result: ResearchProject["analysisResults"][0]) => void;
  insertCitation: (sectionId: string, citation: string, cursorPosition?: number) => void;
  switchProjectType: (newType: ProjectType) => void;
  toggleSectionEnabled: (key: string) => void;
  addCustomSection: (title: string, afterKey?: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  approveSection: (key: string) => void;
  commentOnSection: (key: string, comment: string) => void;
  getComplianceStats: () => { total: number; missing: number; empty: number; approved: number };
}

const ProjectContext = createContext<ProjectContextType | null>(null);

function buildMetaFromTemplate(defs: TemplateSectionDef[], parentKey?: string): SectionMeta[] {
  const result: SectionMeta[] = [];
  for (const d of defs) {
    result.push({ key: d.key, mandatory: d.mandatory, enabled: true, parentKey });
    if (d.children) {
      result.push(...buildMetaFromTemplate(d.children, d.key));
    }
  }
  return result;
}

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

  const insertCitation = useCallback((sectionId: string, citation: string, cursorPosition?: number) => {
    setProject(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId) return s;
        if (cursorPosition !== undefined && cursorPosition >= 0 && cursorPosition <= s.content.length) {
          return { ...s, content: s.content.slice(0, cursorPosition) + " " + citation + s.content.slice(cursorPosition) };
        }
        return { ...s, content: s.content + " " + citation };
      }),
    }));
  }, []);

  const switchProjectType = useCallback((newType: ProjectType) => {
    setProject(prev => {
      const template = SECTION_TEMPLATES[newType];
      const newSections = templateToSections(newType);
      const mappedSections = mapSectionsToTemplate(prev.sections, newSections);
      const newMeta = buildMetaFromTemplate(template);
      // Recalculate integrity
      const mandatoryCount = newMeta.filter(m => m.mandatory).length;
      const filledMandatory = newMeta.filter(m => m.mandatory && mappedSections.find(s => s.id === `tmpl-${m.key}`)?.content?.trim()).length;
      const completeness = mandatoryCount > 0 ? Math.round((filledMandatory / mandatoryCount) * 100) : 100;
      const integrityScore = Math.max(0, Math.min(100, Math.round(completeness * 0.4 + prev.integrityScore * 0.6)));
      return { ...prev, projectType: newType, sections: mappedSections, sectionMeta: newMeta, integrityScore, updatedAt: new Date().toISOString().split("T")[0] };
    });
  }, []);

  const toggleSectionEnabled = useCallback((key: string) => {
    setProject(prev => ({
      ...prev,
      sectionMeta: prev.sectionMeta.map(m => m.key === key ? { ...m, enabled: !m.enabled } : m),
    }));
  }, []);

  const addCustomSection = useCallback((title: string, afterKey?: string) => {
    setProject(prev => {
      const customKey = `custom-${Date.now()}`;
      const customId = `tmpl-${customKey}`;
      const newMeta: SectionMeta = { key: customKey, mandatory: false, enabled: true };
      let insertIdx = prev.sections.length;
      if (afterKey) {
        const afterIdx = prev.sections.findIndex(s => s.id === `tmpl-${afterKey}`);
        if (afterIdx >= 0) insertIdx = afterIdx + 1;
      }
      const newSection: Section = { id: customId, title, order: insertIdx + 1, content: "" };
      const newSections = [...prev.sections];
      newSections.splice(insertIdx, 0, newSection);
      // Re-order
      const reordered = newSections.map((s, i) => ({ ...s, order: i + 1 }));
      return { ...prev, sections: reordered, sectionMeta: [...prev.sectionMeta, newMeta] };
    });
  }, []);

  const reorderSections = useCallback((fromIndex: number, toIndex: number) => {
    setProject(prev => {
      const newSections = [...prev.sections];
      const [moved] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, moved);
      return { ...prev, sections: newSections.map((s, i) => ({ ...s, order: i + 1 })) };
    });
  }, []);

  const approveSection = useCallback((key: string) => {
    setProject(prev => ({
      ...prev,
      sectionMeta: prev.sectionMeta.map(m => m.key === key ? { ...m, approved: !m.approved } : m),
    }));
  }, []);

  const commentOnSection = useCallback((key: string, comment: string) => {
    setProject(prev => ({
      ...prev,
      sectionMeta: prev.sectionMeta.map(m => m.key === key ? { ...m, supervisorComment: comment } : m),
    }));
  }, []);

  const getComplianceStats = useCallback(() => {
    const enabledMandatory = project.sectionMeta.filter(m => m.mandatory && m.enabled);
    const total = enabledMandatory.length;
    const missing = enabledMandatory.filter(m => !project.sections.find(s => s.id === `tmpl-${m.key}`)).length;
    const empty = enabledMandatory.filter(m => {
      const sec = project.sections.find(s => s.id === `tmpl-${m.key}`);
      return sec && !sec.content.trim();
    }).length;
    const approved = project.sectionMeta.filter(m => m.approved).length;
    return { total, missing, empty, approved };
  }, [project.sectionMeta, project.sections]);

  return (
    <ProjectContext.Provider value={{ project, setProject, resetProject, updateSection, toggleChecklist, uploadDataset, addExport, addAnalysisResult, insertCitation, switchProjectType, toggleSectionEnabled, addCustomSection, reorderSections, approveSection, commentOnSection, getComplianceStats }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
};
