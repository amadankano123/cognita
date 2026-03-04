import React, { createContext, useContext, useState, useCallback } from "react";
import { InstitutionData, Faculty, Department, SupervisorAssignment, User } from "@/types/research";
import { mockInstitution } from "@/data/mockInstitution";

interface InstitutionContextType {
  institution: InstitutionData;
  addFaculty: (name: string) => void;
  updateFaculty: (id: string, name: string) => void;
  deleteFaculty: (id: string) => void;
  addDepartment: (name: string, facultyId: string) => void;
  updateDepartment: (id: string, name: string) => void;
  deleteDepartment: (id: string) => void;
  assignSupervisor: (studentId: string, supervisorId: string, assignedBy: string) => void;
  unassignSupervisor: (studentId: string) => void;
  getStudentsForSupervisor: (supervisorId: string) => User[];
  getUnassignedStudents: () => User[];
  getSupervisors: () => User[];
  getDepartmentsForFaculty: (facultyId: string) => Department[];
  updateProjectIntegrity: (projectId: string, score: number) => void;
  updateProjectStatus: (projectId: string, status: string) => void;
  incrementAiUsage: (projectId: string) => void;
  updateIntegrityMetrics: (projectId: string, similarityIndex: number, aiDetectionScore: number) => void;
  updateAiPolicy: (policy: InstitutionData["aiPolicy"]) => void;
}

const InstitutionContext = createContext<InstitutionContextType | null>(null);

export const InstitutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [institution, setInstitution] = useState<InstitutionData>({ ...mockInstitution });

  const addFaculty = useCallback((name: string) => {
    setInstitution(prev => ({
      ...prev,
      faculties: [...prev.faculties, { id: `fac-${Date.now()}`, name }],
    }));
  }, []);

  const updateFaculty = useCallback((id: string, name: string) => {
    setInstitution(prev => ({
      ...prev,
      faculties: prev.faculties.map(f => f.id === id ? { ...f, name } : f),
    }));
  }, []);

  const deleteFaculty = useCallback((id: string) => {
    setInstitution(prev => ({
      ...prev,
      faculties: prev.faculties.filter(f => f.id !== id),
      departmentList: prev.departmentList.filter(d => d.facultyId !== id),
    }));
  }, []);

  const addDepartment = useCallback((name: string, facultyId: string) => {
    setInstitution(prev => ({
      ...prev,
      departmentList: [...prev.departmentList, { id: `dept-${Date.now()}`, name, facultyId }],
    }));
  }, []);

  const updateDepartment = useCallback((id: string, name: string) => {
    setInstitution(prev => ({
      ...prev,
      departmentList: prev.departmentList.map(d => d.id === id ? { ...d, name } : d),
    }));
  }, []);

  const deleteDepartment = useCallback((id: string) => {
    setInstitution(prev => ({
      ...prev,
      departmentList: prev.departmentList.filter(d => d.id !== id),
    }));
  }, []);

  const assignSupervisor = useCallback((studentId: string, supervisorId: string, assignedBy: string) => {
    setInstitution(prev => ({
      ...prev,
      assignments: [...prev.assignments.filter(a => a.studentId !== studentId), { studentId, supervisorId, assignedBy, assignedAt: new Date().toISOString().split("T")[0] }],
      users: prev.users.map(u => u.id === studentId ? { ...u, supervisorId } : u),
    }));
  }, []);

  const unassignSupervisor = useCallback((studentId: string) => {
    setInstitution(prev => ({
      ...prev,
      assignments: prev.assignments.filter(a => a.studentId !== studentId),
      users: prev.users.map(u => u.id === studentId ? { ...u, supervisorId: undefined } : u),
    }));
  }, []);

  const getStudentsForSupervisor = useCallback((supervisorId: string) => {
    return institution.users.filter(u => u.role === "Student" && institution.assignments.some(a => a.studentId === u.id && a.supervisorId === supervisorId));
  }, [institution]);

  const getUnassignedStudents = useCallback(() => {
    return institution.users.filter(u => u.role === "Student" && !institution.assignments.some(a => a.studentId === u.id));
  }, [institution]);

  const getSupervisors = useCallback(() => {
    return institution.users.filter(u => u.role === "Supervisor");
  }, [institution]);

  const getDepartmentsForFaculty = useCallback((facultyId: string) => {
    return institution.departmentList.filter(d => d.facultyId === facultyId);
  }, [institution]);

  const updateProjectIntegrity = useCallback((projectId: string, score: number) => {
    setInstitution(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, integrityScore: score } : p),
    }));
  }, []);

  const updateProjectStatus = useCallback((projectId: string, status: string) => {
    setInstitution(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, status: status as any } : p),
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
      projects: prev.projects.map(p => p.id === projectId ? { ...p, similarityIndex, aiDetectionScore } : p),
    }));
  }, []);

  const updateAiPolicy = useCallback((policy: InstitutionData["aiPolicy"]) => {
    setInstitution(prev => ({ ...prev, aiPolicy: policy }));
  }, []);

  return (
    <InstitutionContext.Provider value={{
      institution, addFaculty, updateFaculty, deleteFaculty, addDepartment, updateDepartment, deleteDepartment,
      assignSupervisor, unassignSupervisor, getStudentsForSupervisor, getUnassignedStudents, getSupervisors,
      getDepartmentsForFaculty, updateProjectIntegrity, updateProjectStatus, incrementAiUsage, updateIntegrityMetrics,
      updateAiPolicy,
    }}>
      {children}
    </InstitutionContext.Provider>
  );
};

export const useInstitution = () => {
  const ctx = useContext(InstitutionContext);
  if (!ctx) throw new Error("useInstitution must be used within InstitutionProvider");
  return ctx;
};
