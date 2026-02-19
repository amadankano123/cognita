export type DegreeLevel = "Undergraduate" | "Master's" | "PhD";
export type ProjectStage = "Proposal" | "Literature Review" | "Data Collection" | "Analysis" | "Writing" | "Submission";
export type ComplianceStatus = "Good" | "Warning" | "Critical";
export type StageStatus = "not-started" | "in-progress" | "completed" | "needs-revision";

export interface SupervisedStudent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  degreeLevel: DegreeLevel;
  department: string;
  projectTitle: string;
  stage: ProjectStage;
  progress: number;
  complianceStatus: ComplianceStatus;
  lastActivity: string;
  enrolledSince: string;
  deadline?: string;
  integrityScore: number;
  similarityIndex: number;
  aiDetectionScore: number;
  wordCount: number;
  targetWordCount: number;
  stages: {
    name: ProjectStage;
    status: StageStatus;
    dueDate?: string;
    supervisorApproved: boolean;
    comments: StageComment[];
  }[];
  sections: {
    id: string;
    title: string;
    wordCount: number;
    status: StageStatus;
    approved: boolean;
    supervisorComment?: string;
  }[];
  analyses: {
    id: string;
    title: string;
    testType: string;
    aiRecommended: boolean;
    status: "pending" | "completed" | "flagged";
    pValue?: number;
    result?: string;
    supervisorNote?: string;
  }[];
  notifications: StudentNotification[];
  feedbackThreads: FeedbackThread[];
}

export interface StageComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface StudentNotification {
  id: string;
  type: "overdue" | "missing-data" | "plagiarism-risk" | "analysis-issue" | "deadline" | "milestone";
  message: string;
  timestamp: string;
  read: boolean;
}

export interface FeedbackThread {
  id: string;
  subject: string;
  messages: { author: string; text: string; timestamp: string; isStudent: boolean }[];
  resolved: boolean;
}

const makeId = () => Math.random().toString(36).slice(2, 10);

export const mockSupervisedStudents: SupervisedStudent[] = [
  {
    id: "stu-001",
    name: "Amara Okafor",
    email: "amara.okafor@university.ac",
    degreeLevel: "PhD",
    department: "Computer Science",
    projectTitle: "Federated Learning for Healthcare Data Privacy",
    stage: "Analysis",
    progress: 62,
    complianceStatus: "Good",
    lastActivity: "2 hours ago",
    enrolledSince: "2024-02-15",
    deadline: "2026-08-30",
    integrityScore: 91,
    similarityIndex: 8,
    aiDetectionScore: 12,
    wordCount: 34200,
    targetWordCount: 80000,
    stages: [
      { name: "Proposal", status: "completed", dueDate: "2024-06-01", supervisorApproved: true, comments: [{ id: makeId(), author: "Supervisor", text: "Excellent proposal. Proceed.", timestamp: "2024-05-28" }] },
      { name: "Literature Review", status: "completed", dueDate: "2024-12-01", supervisorApproved: true, comments: [] },
      { name: "Data Collection", status: "completed", dueDate: "2025-06-01", supervisorApproved: true, comments: [] },
      { name: "Analysis", status: "in-progress", dueDate: "2026-01-15", supervisorApproved: false, comments: [] },
      { name: "Writing", status: "in-progress", supervisorApproved: false, comments: [] },
      { name: "Submission", status: "not-started", dueDate: "2026-08-30", supervisorApproved: false, comments: [] },
    ],
    sections: [
      { id: "s1", title: "Introduction", wordCount: 4200, status: "completed", approved: true },
      { id: "s2", title: "Literature Review", wordCount: 12500, status: "completed", approved: true },
      { id: "s3", title: "Methodology", wordCount: 8400, status: "completed", approved: false, supervisorComment: "Clarify federated averaging algorithm details." },
      { id: "s4", title: "Results", wordCount: 6100, status: "in-progress", approved: false },
      { id: "s5", title: "Discussion", wordCount: 2100, status: "in-progress", approved: false },
      { id: "s6", title: "Conclusion", wordCount: 900, status: "not-started", approved: false },
    ],
    analyses: [
      { id: "a1", title: "Model Accuracy Comparison", testType: "One-way ANOVA", aiRecommended: true, status: "completed", pValue: 0.003, result: "Significant difference between federated models (F(3,96) = 4.82, p = .003)" },
      { id: "a2", title: "Privacy-Accuracy Trade-off", testType: "Pearson Correlation", aiRecommended: true, status: "completed", pValue: 0.01, result: "Strong negative correlation (r = -0.72, p = .01)" },
      { id: "a3", title: "Convergence Rate Analysis", testType: "Linear Regression", aiRecommended: false, status: "flagged", supervisorNote: "Verify normality assumption before proceeding." },
    ],
    notifications: [
      { id: "n1", type: "analysis-issue", message: "Convergence Rate Analysis flagged — assumption check needed", timestamp: "2 hours ago", read: false },
      { id: "n2", type: "deadline", message: "Analysis stage due in 45 days", timestamp: "1 day ago", read: true },
    ],
    feedbackThreads: [
      { id: "f1", subject: "Methodology clarification", messages: [
        { author: "Prof. Mwangi", text: "Please clarify the federated averaging algorithm details in Section 3.2.", timestamp: "2026-01-10", isStudent: false },
        { author: "Amara Okafor", text: "I've updated Section 3.2 with the FedAvg pseudocode and parameter details.", timestamp: "2026-01-12", isStudent: true },
      ], resolved: false },
    ],
  },
  {
    id: "stu-002",
    name: "James Thornton",
    email: "james.thornton@university.ac",
    degreeLevel: "Master's",
    department: "Psychology",
    projectTitle: "Impact of Social Media on Academic Performance Among University Students",
    stage: "Writing",
    progress: 78,
    complianceStatus: "Warning",
    lastActivity: "1 day ago",
    enrolledSince: "2025-01-10",
    deadline: "2026-06-15",
    integrityScore: 74,
    similarityIndex: 22,
    aiDetectionScore: 31,
    wordCount: 18400,
    targetWordCount: 25000,
    stages: [
      { name: "Proposal", status: "completed", supervisorApproved: true, comments: [] },
      { name: "Literature Review", status: "completed", supervisorApproved: true, comments: [] },
      { name: "Data Collection", status: "completed", supervisorApproved: true, comments: [] },
      { name: "Analysis", status: "completed", supervisorApproved: true, comments: [] },
      { name: "Writing", status: "in-progress", dueDate: "2026-05-01", supervisorApproved: false, comments: [] },
      { name: "Submission", status: "not-started", dueDate: "2026-06-15", supervisorApproved: false, comments: [] },
    ],
    sections: [
      { id: "s1", title: "Introduction", wordCount: 2800, status: "completed", approved: true },
      { id: "s2", title: "Literature Review", wordCount: 6200, status: "completed", approved: true },
      { id: "s3", title: "Methodology", wordCount: 3400, status: "completed", approved: true },
      { id: "s4", title: "Results", wordCount: 3800, status: "completed", approved: false, supervisorComment: "Tables need APA formatting." },
      { id: "s5", title: "Discussion", wordCount: 1900, status: "in-progress", approved: false },
      { id: "s6", title: "Conclusion", wordCount: 300, status: "not-started", approved: false },
    ],
    analyses: [
      { id: "a1", title: "Screen Time vs GPA", testType: "Pearson Correlation", aiRecommended: true, status: "completed", pValue: 0.018, result: "Moderate negative correlation (r = -0.42, p = .018)" },
      { id: "a2", title: "Gender Differences in Usage", testType: "Independent t-test", aiRecommended: true, status: "completed", pValue: 0.34, result: "No significant difference (t(98) = 0.96, p = .34)" },
    ],
    notifications: [
      { id: "n1", type: "plagiarism-risk", message: "Similarity index at 22% — borderline threshold", timestamp: "1 day ago", read: false },
      { id: "n2", type: "overdue", message: "Discussion section behind schedule", timestamp: "3 days ago", read: true },
    ],
    feedbackThreads: [],
  },
  {
    id: "stu-003",
    name: "Fatima Al-Hassan",
    email: "fatima.alhassan@university.ac",
    degreeLevel: "Undergraduate",
    department: "Biology",
    projectTitle: "Effects of Urbanization on Bird Species Diversity",
    stage: "Data Collection",
    progress: 35,
    complianceStatus: "Good",
    lastActivity: "5 hours ago",
    enrolledSince: "2025-09-01",
    deadline: "2026-05-30",
    integrityScore: 95,
    similarityIndex: 4,
    aiDetectionScore: 5,
    wordCount: 4800,
    targetWordCount: 12000,
    stages: [
      { name: "Proposal", status: "completed", supervisorApproved: true, comments: [] },
      { name: "Literature Review", status: "completed", supervisorApproved: true, comments: [] },
      { name: "Data Collection", status: "in-progress", dueDate: "2026-02-28", supervisorApproved: false, comments: [] },
      { name: "Analysis", status: "not-started", supervisorApproved: false, comments: [] },
      { name: "Writing", status: "not-started", supervisorApproved: false, comments: [] },
      { name: "Submission", status: "not-started", dueDate: "2026-05-30", supervisorApproved: false, comments: [] },
    ],
    sections: [
      { id: "s1", title: "Introduction", wordCount: 1200, status: "completed", approved: true },
      { id: "s2", title: "Literature Review", wordCount: 2800, status: "completed", approved: true },
      { id: "s3", title: "Methodology", wordCount: 800, status: "in-progress", approved: false },
    ],
    analyses: [],
    notifications: [
      { id: "n1", type: "deadline", message: "Data collection due in 9 days", timestamp: "Today", read: false },
    ],
    feedbackThreads: [],
  },
  {
    id: "stu-004",
    name: "Chen Wei Lin",
    email: "chenwei.lin@university.ac",
    degreeLevel: "PhD",
    department: "Economics",
    projectTitle: "Monetary Policy Transmission in Emerging Economies Post-COVID",
    stage: "Literature Review",
    progress: 22,
    complianceStatus: "Good",
    lastActivity: "3 days ago",
    enrolledSince: "2025-06-01",
    deadline: "2028-05-30",
    integrityScore: 97,
    similarityIndex: 3,
    aiDetectionScore: 8,
    wordCount: 11200,
    targetWordCount: 80000,
    stages: [
      { name: "Proposal", status: "completed", supervisorApproved: true, comments: [] },
      { name: "Literature Review", status: "in-progress", dueDate: "2026-06-01", supervisorApproved: false, comments: [] },
      { name: "Data Collection", status: "not-started", supervisorApproved: false, comments: [] },
      { name: "Analysis", status: "not-started", supervisorApproved: false, comments: [] },
      { name: "Writing", status: "not-started", supervisorApproved: false, comments: [] },
      { name: "Submission", status: "not-started", dueDate: "2028-05-30", supervisorApproved: false, comments: [] },
    ],
    sections: [
      { id: "s1", title: "Introduction", wordCount: 3200, status: "completed", approved: true },
      { id: "s2", title: "Literature Review", wordCount: 8000, status: "in-progress", approved: false },
    ],
    analyses: [],
    notifications: [],
    feedbackThreads: [],
  },
  {
    id: "stu-005",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@university.ac",
    degreeLevel: "Master's",
    department: "Education",
    projectTitle: "Blended Learning Effectiveness in Secondary Schools",
    stage: "Submission",
    progress: 95,
    complianceStatus: "Critical",
    lastActivity: "6 hours ago",
    enrolledSince: "2025-01-15",
    deadline: "2026-03-01",
    integrityScore: 62,
    similarityIndex: 38,
    aiDetectionScore: 48,
    wordCount: 23800,
    targetWordCount: 25000,
    stages: [
      { name: "Proposal", status: "completed", supervisorApproved: true, comments: [] },
      { name: "Literature Review", status: "completed", supervisorApproved: true, comments: [] },
      { name: "Data Collection", status: "completed", supervisorApproved: true, comments: [] },
      { name: "Analysis", status: "completed", supervisorApproved: true, comments: [] },
      { name: "Writing", status: "completed", supervisorApproved: true, comments: [] },
      { name: "Submission", status: "in-progress", dueDate: "2026-03-01", supervisorApproved: false, comments: [] },
    ],
    sections: [
      { id: "s1", title: "Introduction", wordCount: 2600, status: "completed", approved: true },
      { id: "s2", title: "Literature Review", wordCount: 7200, status: "completed", approved: true },
      { id: "s3", title: "Methodology", wordCount: 4100, status: "completed", approved: true },
      { id: "s4", title: "Results", wordCount: 4500, status: "completed", approved: true },
      { id: "s5", title: "Discussion", wordCount: 3800, status: "completed", approved: false, supervisorComment: "Reduce similarity in paragraphs 3-5." },
      { id: "s6", title: "Conclusion", wordCount: 1600, status: "completed", approved: false },
    ],
    analyses: [
      { id: "a1", title: "Pre-Post Comparison", testType: "Paired t-test", aiRecommended: true, status: "completed", pValue: 0.001, result: "Significant improvement (t(45) = 3.42, p = .001, d = 0.51)" },
      { id: "a2", title: "Learning Mode Comparison", testType: "One-way ANOVA", aiRecommended: true, status: "completed", pValue: 0.012, result: "Significant difference across modes (F(2,135) = 4.56, p = .012)" },
    ],
    notifications: [
      { id: "n1", type: "plagiarism-risk", message: "Similarity at 38% — CRITICAL. Immediate revision required.", timestamp: "6 hours ago", read: false },
      { id: "n2", type: "plagiarism-risk", message: "AI detection at 48% — exceeds threshold", timestamp: "6 hours ago", read: false },
      { id: "n3", type: "deadline", message: "Submission deadline in 10 days", timestamp: "Today", read: false },
    ],
    feedbackThreads: [
      { id: "f1", subject: "Plagiarism concerns", messages: [
        { author: "Prof. Mwangi", text: "Sarah, your similarity index is at 38%. Please revise the Discussion section immediately. Paraphrase and cite properly.", timestamp: "2026-02-18", isStudent: false },
      ], resolved: false },
    ],
  },
];
