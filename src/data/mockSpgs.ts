// Mock institutional postgraduate dataset powering the SPGS Oversight module.
// Aggregates lifecycle progress that — in production — would be derived from
// existing Cognita student, supervisor, seminar and thesis records.

export type PgDegree = "MSc" | "PhD" | "PGD";

export type PgStage =
  | "Coursework"
  | "Proposal Seminar"
  | "Field/Lab Research"
  | "Data Collection"
  | "Data Analysis"
  | "PhD Progress Seminar"
  | "Draft Thesis Review"
  | "Final Seminar"
  | "External Examination Readiness"
  | "External Examination"
  | "Correction & SPGS Submission"
  | "Senate Approval"
  | "Degree Awarded";

export type MilestoneStatus =
  | "not-started"
  | "in-progress"
  | "scheduled"
  | "presented"
  | "passed"
  | "completed"
  | "pending"
  | "corrections"
  | "cleared"
  | "ready"
  | "under-review"
  | "submitted"
  | "approved"
  | "delayed";

export interface PgMilestone {
  key: PgStage;
  status: MilestoneStatus;
  completedAt?: string;
  dueAt?: string;
}

export interface PgStudent {
  id: string;
  name: string;
  matric: string;
  email: string;
  faculty: string;
  department: string;
  programme: string;
  degree: PgDegree;
  enrolmentYear: number;
  session: string;
  supervisor: string;
  researchArea: string;
  currentStage: PgStage;
  progress: number;
  residencyMonths: number;
  residencyLimitMonths: number;
  daysInactive: number;
  riskScore: number;
  completionForecast: string;
  delayFlags: string[];
  milestones: PgMilestone[];
}

export interface SpgsFacultySummary {
  faculty: string;
  students: number;
  active: number;
  delayed: number;
  graduated: number;
  avgCompletionMonths: number;
}

export interface SenateBatch {
  id: string;
  session: string;
  scheduled: string;
  studentsReady: number;
  pendingClearance: number;
  status: "compiling" | "ready" | "submitted" | "approved";
}

const stageOrder: PgStage[] = [
  "Coursework",
  "Proposal Seminar",
  "Field/Lab Research",
  "Data Collection",
  "Data Analysis",
  "PhD Progress Seminar",
  "Draft Thesis Review",
  "Final Seminar",
  "External Examination Readiness",
  "External Examination",
  "Correction & SPGS Submission",
  "Senate Approval",
  "Degree Awarded",
];

const buildMilestones = (current: PgStage, degree: PgDegree): PgMilestone[] => {
  const filtered = stageOrder.filter((s) => degree !== "MSc" || s !== "PhD Progress Seminar");
  const idx = filtered.indexOf(current);
  return filtered.map((stage, i) => {
    if (i < idx) return { key: stage, status: "passed" as MilestoneStatus, completedAt: "2025-10-12" };
    if (i === idx) return { key: stage, status: "in-progress" as MilestoneStatus, dueAt: "2026-03-30" };
    return { key: stage, status: "not-started" as MilestoneStatus };
  });
};

export const SPGS_FACULTIES = [
  "Faculty of Science",
  "Faculty of Engineering",
  "Faculty of Social Sciences",
  "Faculty of Medicine",
  "Faculty of Arts",
];

export const mockPgStudents: PgStudent[] = [
  {
    id: "pg-001", name: "Adaeze Okeke", matric: "PG/CS/22/0431", email: "a.okeke@uni.edu",
    faculty: "Faculty of Science", department: "Computer Science", programme: "MSc Computer Science",
    degree: "MSc", enrolmentYear: 2022, session: "2024/2025", supervisor: "Dr. Fatima Hassan",
    researchArea: "Computer Vision in Agriculture", currentStage: "Data Analysis", progress: 62,
    residencyMonths: 28, residencyLimitMonths: 36, daysInactive: 4, riskScore: 22,
    completionForecast: "On track — Q3 2026", delayFlags: [],
    milestones: buildMilestones("Data Analysis", "MSc"),
  },
  {
    id: "pg-002", name: "Tunde Bakare", matric: "PG/EE/20/0118", email: "t.bakare@uni.edu",
    faculty: "Faculty of Engineering", department: "Electrical Engineering", programme: "PhD Electrical Eng.",
    degree: "PhD", enrolmentYear: 2020, session: "2024/2025", supervisor: "Prof. Idris Yusuf",
    researchArea: "Smart Grid Optimisation", currentStage: "External Examination", progress: 86,
    residencyMonths: 58, residencyLimitMonths: 60, daysInactive: 12, riskScore: 71,
    completionForecast: "At risk — residency expiring", delayFlags: ["Residency expiring", "External examiner delay"],
    milestones: buildMilestones("External Examination", "PhD"),
  },
  {
    id: "pg-003", name: "Chioma Eze", matric: "PG/BIO/23/0042", email: "c.eze@uni.edu",
    faculty: "Faculty of Science", department: "Biology", programme: "MSc Molecular Biology",
    degree: "MSc", enrolmentYear: 2023, session: "2024/2025", supervisor: "Dr. Aisha Mohammed",
    researchArea: "CRISPR Diagnostics", currentStage: "Proposal Seminar", progress: 24,
    residencyMonths: 16, residencyLimitMonths: 36, daysInactive: 2, riskScore: 14,
    completionForecast: "On track — Q1 2027", delayFlags: [],
    milestones: buildMilestones("Proposal Seminar", "MSc"),
  },
  {
    id: "pg-004", name: "Samuel Ojo", matric: "PG/MED/21/0277", email: "s.ojo@uni.edu",
    faculty: "Faculty of Medicine", department: "Public Health", programme: "PhD Public Health",
    degree: "PhD", enrolmentYear: 2021, session: "2024/2025", supervisor: "Prof. Ngozi Adeyemi",
    researchArea: "Epidemiology of NCDs", currentStage: "Draft Thesis Review", progress: 72,
    residencyMonths: 44, residencyLimitMonths: 60, daysInactive: 38, riskScore: 64,
    completionForecast: "Delayed — supervisor review overdue",
    delayFlags: ["Supervisor review overdue", "Student inactive 38d"],
    milestones: buildMilestones("Draft Thesis Review", "PhD"),
  },
  {
    id: "pg-005", name: "Maryam Bello", matric: "PG/SOC/22/0589", email: "m.bello@uni.edu",
    faculty: "Faculty of Social Sciences", department: "Sociology", programme: "MSc Sociology",
    degree: "MSc", enrolmentYear: 2022, session: "2024/2025", supervisor: "Dr. Henry Olu",
    researchArea: "Urban Migration", currentStage: "Senate Approval", progress: 96,
    residencyMonths: 30, residencyLimitMonths: 36, daysInactive: 1, riskScore: 8,
    completionForecast: "Senate-ready", delayFlags: [],
    milestones: buildMilestones("Senate Approval", "MSc"),
  },
  {
    id: "pg-006", name: "Ibrahim Sanni", matric: "PG/CHE/19/0091", email: "i.sanni@uni.edu",
    faculty: "Faculty of Engineering", department: "Chemical Engineering", programme: "PhD Chemical Eng.",
    degree: "PhD", enrolmentYear: 2019, session: "2024/2025", supervisor: "Prof. Kelechi Nwosu",
    researchArea: "Catalysis", currentStage: "Correction & SPGS Submission", progress: 90,
    residencyMonths: 71, residencyLimitMonths: 72, daysInactive: 22, riskScore: 88,
    completionForecast: "Critical — exceeds residency next month",
    delayFlags: ["Residency exceeded", "Corrections pending > 60d"],
    milestones: buildMilestones("Correction & SPGS Submission", "PhD"),
  },
  {
    id: "pg-007", name: "Esther Adewale", matric: "PG/ART/23/0114", email: "e.adewale@uni.edu",
    faculty: "Faculty of Arts", department: "English", programme: "MSc Linguistics",
    degree: "MSc", enrolmentYear: 2023, session: "2024/2025", supervisor: "Dr. Femi Adebayo",
    researchArea: "Sociolinguistics", currentStage: "Coursework", progress: 12,
    residencyMonths: 10, residencyLimitMonths: 36, daysInactive: 1, riskScore: 6,
    completionForecast: "On track", delayFlags: [],
    milestones: buildMilestones("Coursework", "MSc"),
  },
  {
    id: "pg-008", name: "Daniel Kalu", matric: "PG/CS/21/0220", email: "d.kalu@uni.edu",
    faculty: "Faculty of Science", department: "Computer Science", programme: "PhD Computer Science",
    degree: "PhD", enrolmentYear: 2021, session: "2024/2025", supervisor: "Dr. Fatima Hassan",
    researchArea: "Federated Learning", currentStage: "Final Seminar", progress: 80,
    residencyMonths: 46, residencyLimitMonths: 60, daysInactive: 7, riskScore: 28,
    completionForecast: "On track — Q4 2026", delayFlags: [],
    milestones: buildMilestones("Final Seminar", "PhD"),
  },
];

export const mockSpgsFacultySummary: SpgsFacultySummary[] = [
  { faculty: "Faculty of Science", students: 48, active: 41, delayed: 5, graduated: 12, avgCompletionMonths: 32 },
  { faculty: "Faculty of Engineering", students: 36, active: 29, delayed: 6, graduated: 8, avgCompletionMonths: 38 },
  { faculty: "Faculty of Social Sciences", students: 27, active: 23, delayed: 3, graduated: 9, avgCompletionMonths: 30 },
  { faculty: "Faculty of Medicine", students: 19, active: 16, delayed: 4, graduated: 5, avgCompletionMonths: 41 },
  { faculty: "Faculty of Arts", students: 14, active: 12, delayed: 1, graduated: 4, avgCompletionMonths: 28 },
];

export const mockSenateBatches: SenateBatch[] = [
  { id: "sn-2025-1", session: "2024/2025 — Batch I", scheduled: "2026-04-12", studentsReady: 14, pendingClearance: 3, status: "compiling" },
  { id: "sn-2025-2", session: "2024/2025 — Batch II", scheduled: "2026-07-20", studentsReady: 0, pendingClearance: 0, status: "compiling" },
  { id: "sn-2024-2", session: "2023/2024 — Batch II", scheduled: "2025-09-15", studentsReady: 22, pendingClearance: 0, status: "approved" },
];

export const mockSpgsTrends = [
  { month: "Sep", proposals: 12, finalSeminars: 4, senate: 2 },
  { month: "Oct", proposals: 9, finalSeminars: 6, senate: 3 },
  { month: "Nov", proposals: 14, finalSeminars: 7, senate: 5 },
  { month: "Dec", proposals: 6, finalSeminars: 3, senate: 4 },
  { month: "Jan", proposals: 11, finalSeminars: 8, senate: 6 },
  { month: "Feb", proposals: 15, finalSeminars: 10, senate: 7 },
];
