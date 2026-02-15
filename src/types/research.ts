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

export interface ResearchProject {
  id: string;
  title: string;
  subtitle: string;
  discipline: string;
  targetOutput: string;
  methodologyType: string;
  targetJournal: string;
  status: "draft" | "in-progress" | "review" | "submitted";
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  sections: Section[];
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
}
