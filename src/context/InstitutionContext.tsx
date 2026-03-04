import React, { createContext, useContext, useState, useCallback } from "react";
import { InstitutionData } from "@/types/research";
import { mockInstitution } from "@/data/mockInstitution";

interface InstitutionContextType {
  institution: InstitutionData;
  updateProjectIntegrity: (projectId: string, score: number) => void;
  updateProjectStatus: (projectId: string, status: string) => void;
  incrementAiUsage: (projectId: string) => void;
  updateIntegrityMetrics: (projectId: string, similarityIndex: number, aiDetectionScore: number) => void;
}

const InstitutionContext = createContext<InstitutionContextType | null>(null);

export const InstitutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [institution, setInstitution] = useState<InstitutionData>({ ...mockInstitution });

  const updateProjectIntegrity = useCallback((projectId: string, score: number) => {
    setInstitution(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, integrityScore: score, aiReviewHistory: [{ date: new Date().toISOString().split("T")[0], score }, ...p.aiReviewHistory] } : p),
    }));
  }, []);

  const updateProjectStatus = useCallback((projectId: string, status: string) => {
    setInstitution(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, status: status as any, lastUpdated: new Date().toISOString().split("T")[0] } : p),
    }));
  }, []);

  const incrementAiUsage = useCallback((projectId: string) => {
    setInstitution(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        const levels = ["None", "Low", "Moderate", "High"] as const;
        const idx = Math.min(levels.indexOf(p.aiUsageLevel) + 1, 3);
        return { ...p, aiUsageLevel: levels[idx] };
      }),
    }));
  }, []);

  const updateIntegrityMetrics = useCallback((projectId: string, similarityIndex: number, aiDetectionScore: number) => {
    setInstitution(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId
          ? { ...p, similarityIndex, aiDetectionScore, lastUpdated: new Date().toISOString().split("T")[0] }
          : p
      ),
    }));
  }, []);

  return (
    <InstitutionContext.Provider value={{ institution, updateProjectIntegrity, updateProjectStatus, incrementAiUsage, updateIntegrityMetrics }}>
      {children}
    </InstitutionContext.Provider>
  );
};

export const useInstitution = () => {
  const ctx = useContext(InstitutionContext);
  if (!ctx) throw new Error("useInstitution must be used within InstitutionProvider");
  return ctx;
};
