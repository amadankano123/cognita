export type AppRole =
  | "Undergraduate Student"
  | "Master's Student"
  | "PhD Student"
  | "Researcher"
  | "Supervisor"
  | "Head of Department"
  | "Research Director"
  | "Compliance Officer";

export const ADMIN_ROLES: AppRole[] = ["Research Director", "Compliance Officer"];
export const HOD_ROLES: AppRole[] = ["Head of Department"];
export const RESEARCHER_ROLES: AppRole[] = ["Undergraduate Student", "Master's Student", "PhD Student", "Researcher", "Supervisor"];

export interface RoleGroup {
  label: string;
  roles: { value: AppRole; label: string }[];
}

export const ROLE_GROUPS: RoleGroup[] = [
  { label: "Undergraduate", roles: [{ value: "Undergraduate Student", label: "Undergraduate Student" }] },
  {
    label: "Postgraduate",
    roles: [
      { value: "Master's Student", label: "Master's Student" },
      { value: "PhD Student", label: "PhD Student" },
    ],
  },
  { label: "Faculty", roles: [
    { value: "Researcher", label: "Researcher" },
    { value: "Supervisor", label: "Supervisor" },
    { value: "Head of Department", label: "Head of Department" },
  ]},
  { label: "Administration", roles: [
    { value: "Research Director", label: "Research Director (Admin)" },
    { value: "Compliance Officer", label: "Compliance Officer (Admin)" },
  ]},
];

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  institution: string;
}

export interface Reference {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  doi?: string;
  tags: string[];
  abstract?: string;
  status?: "valid" | "missing-doi" | "unchecked";
  cited?: boolean;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface DataFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  description: string;
}

export interface DatasetColumn {
  name: string;
  type: "text" | "number" | "category";
}

export interface Dataset {
  uploaded: boolean;
  name: string;
  columns: DatasetColumn[];
  previewRows: Record<string, string | number>[];
}

export interface AnalysisResult {
  id: string;
  title: string;
  type: string;
  status: "pending" | "running" | "completed" | "failed";
  summary?: string;
  createdAt: string;
  rSquared?: number;
  pValue?: number;
  interpretation?: string;
}

export interface ReviewIssue {
  id: string;
  sectionId: string;
  sectionTitle: string;
  severity: "critical" | "major" | "minor" | "suggestion";
  message: string;
  suggestion?: string;
}

export interface ReviewScore {
  category: string;
  score: number;
  maxScore: number;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: "owner" | "editor" | "reviewer" | "viewer";
  avatar?: string;
  lastActive: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface ExportRecord {
  id: string;
  format: string;
  citationStyle: string;
  fileName: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface SectionMeta {
  key: string;
  mandatory: boolean;
  enabled: boolean;
  parentKey?: string;
  approved?: boolean;
  supervisorComment?: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  subtitle: string;
  discipline: string;
  targetOutput: string;
  methodologyType: string;
  targetJournal: string;
  projectType: string;
  status: "draft" | "in-progress" | "review" | "submitted" | "exported";
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  sections: Section[];
  sectionMeta: SectionMeta[];
  references: Reference[];
  dataFiles: DataFile[];
  dataset: Dataset;
  analysisResults: AnalysisResult[];
  reviewScores: ReviewScore[];
  reviewIssues: ReviewIssue[];
  collaborators: Collaborator[];
  checklist: ChecklistItem[];
  exports: ExportRecord[];
  activities: ActivityItem[];
  progress: number;
  wordCount: number;
  targetWordCount: number;
  integrityScore: number;
  aiUsageLevel: "None" | "Low" | "Moderate" | "High";
  aiMode: string;
}

// --- Institution Layer Types ---

export interface InstitutionalProject {
  id: string;
  title: string;
  researcher: string;
  department: string;
  status: "draft" | "in-progress" | "review" | "submitted" | "exported";
  aiUsageLevel: "None" | "Low" | "Moderate" | "High";
  integrityScore: number;
  similarityIndex: number;
  aiDetectionScore: number;
  lastUpdated: string;
  aiMode: string;
  exportHistory: { date: string; format: string }[];
  aiReviewHistory: { date: string; score: number }[];
  integrityIssues: string[];
  datasetStatus: "not-uploaded" | "uploaded" | "analyzed";
  sections: { title: string; wordCount: number }[];
}

export interface InstitutionAlert {
  id: string;
  type: "warning" | "critical" | "info";
  message: string;
  projectId?: string;
  timestamp: string;
}

export interface ResearcherProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  projectCount: number;
  publications: number;
  integrityScore: number;
  lastActive: string;
}

export interface InstitutionData {
  name: string;
  totalResearchers: number;
  activeProjects: number;
  publicationsThisYear: number;
  projects: InstitutionalProject[];
  alerts: InstitutionAlert[];
  researchers: ResearcherProfile[];
  aiReviewsThisMonth: number;
  departments: string[];
}
