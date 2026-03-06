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

const allStages: ProjectStage[] = ["Proposal", "Literature Review", "Data Collection", "Analysis", "Writing", "Submission"];

function makeStages(currentStage: ProjectStage): SupervisedStudent["stages"] {
  const idx = allStages.indexOf(currentStage);
  return allStages.map((name, i) => ({
    name,
    status: (i < idx ? "completed" : i === idx ? "in-progress" : "not-started") as StageStatus,
    supervisorApproved: i < idx,
    comments: [],
  }));
}

function makeStudent(
  id: string, name: string, email: string, degreeLevel: DegreeLevel, dept: string,
  projectTitle: string, stage: ProjectStage, progress: number, compliance: ComplianceStatus,
  integrity: number, similarity: number, aiDetection: number, wordCount: number, targetWordCount: number,
): SupervisedStudent {
  return {
    id, name, email, degreeLevel, department: dept, projectTitle, stage, progress,
    complianceStatus: compliance, lastActivity: `${Math.floor(Math.random() * 48) + 1} hours ago`,
    enrolledSince: "2025-01-15", integrityScore: integrity, similarityIndex: similarity,
    aiDetectionScore: aiDetection, wordCount, targetWordCount,
    stages: makeStages(stage),
    sections: [], analyses: [], notifications: [], feedbackThreads: [],
  };
}

// All department students (used by HOD)
export const mockDepartmentStudents: SupervisedStudent[] = [
  // ── Undergraduate Students (20) ──
  makeStudent("stu-ug-001", "Fatima Al-Hassan", "fatima@university.ac", "Undergraduate", "Computer Science",
    "Effects of Urbanization on Bird Species Diversity", "Data Collection", 35, "Good", 95, 4, 5, 4800, 12000),
  makeStudent("stu-ug-002", "Daniel Mensah", "d.mensah@university.ac", "Undergraduate", "Computer Science",
    "Mobile App for Campus Navigation Using BLE Beacons", "Writing", 72, "Good", 89, 10, 8, 8600, 12000),
  makeStudent("stu-ug-003", "Priya Nair", "p.nair@university.ac", "Undergraduate", "Computer Science",
    "Sentiment Analysis of Student Feedback Using NLP", "Analysis", 55, "Good", 92, 7, 11, 6200, 12000),
  makeStudent("stu-ug-004", "Kwesi Adjei", "k.adjei@university.ac", "Undergraduate", "Computer Science",
    "Blockchain-Based Voting System for Student Elections", "Literature Review", 20, "Good", 97, 3, 4, 2400, 12000),
  makeStudent("stu-ug-005", "Lena Kowalski", "l.kowalski@university.ac", "Undergraduate", "Computer Science",
    "Gamification in E-Learning Platforms", "Data Collection", 40, "Warning", 78, 18, 22, 4900, 12000),
  makeStudent("stu-ug-006", "Ibrahim Yusuf", "i.yusuf@university.ac", "Undergraduate", "Computer Science",
    "IoT-Based Smart Irrigation System", "Proposal", 8, "Good", 98, 2, 3, 900, 12000),
  makeStudent("stu-ug-007", "Grace Obi", "g.obi@university.ac", "Undergraduate", "Computer Science",
    "Comparative Study of Sorting Algorithms on Large Datasets", "Writing", 80, "Good", 90, 9, 7, 9600, 12000),
  makeStudent("stu-ug-008", "Tomás Silva", "t.silva@university.ac", "Undergraduate", "Computer Science",
    "Augmented Reality for Anatomy Education", "Analysis", 50, "Good", 93, 6, 9, 5800, 12000),
  makeStudent("stu-ug-009", "Aisha Kamara", "a.kamara@university.ac", "Undergraduate", "Computer Science",
    "Cybersecurity Awareness Among University Students", "Data Collection", 38, "Warning", 76, 20, 25, 4500, 12000),
  makeStudent("stu-ug-010", "Rajesh Patel", "r.patel@university.ac", "Undergraduate", "Computer Science",
    "Machine Learning for Crop Disease Detection", "Literature Review", 25, "Good", 96, 5, 6, 3000, 12000),
  makeStudent("stu-ug-011", "Chiamaka Eze", "c.eze@university.ac", "Undergraduate", "Computer Science",
    "Social Media Influence on Consumer Purchasing Behaviour", "Writing", 85, "Critical", 65, 32, 40, 10200, 12000),
  makeStudent("stu-ug-012", "Jun Tanaka", "j.tanaka@university.ac", "Undergraduate", "Computer Science",
    "Real-Time Traffic Monitoring Using Computer Vision", "Analysis", 58, "Good", 91, 8, 10, 6900, 12000),
  makeStudent("stu-ug-013", "Nadia Benali", "n.benali@university.ac", "Undergraduate", "Computer Science",
    "Chatbot for University Admissions FAQ", "Data Collection", 42, "Good", 94, 5, 7, 5000, 12000),
  makeStudent("stu-ug-014", "Emeka Nwosu", "e.nwosu@university.ac", "Undergraduate", "Computer Science",
    "Renewable Energy Forecasting with Neural Networks", "Proposal", 10, "Good", 99, 1, 2, 1100, 12000),
  makeStudent("stu-ug-015", "Sophie Dupont", "s.dupont@university.ac", "Undergraduate", "Computer Science",
    "Digital Literacy Assessment Tool for Rural Schools", "Literature Review", 28, "Good", 88, 11, 14, 3300, 12000),
  makeStudent("stu-ug-016", "Kofi Asante", "k.asante@university.ac", "Undergraduate", "Computer Science",
    "Waste Management App for Urban Communities", "Writing", 75, "Good", 87, 12, 10, 9000, 12000),
  makeStudent("stu-ug-017", "Maria Gonzalez", "m.gonzalez@university.ac", "Undergraduate", "Computer Science",
    "Predicting Student Dropout Using Logistic Regression", "Analysis", 52, "Warning", 80, 16, 19, 6100, 12000),
  makeStudent("stu-ug-018", "Yusuf Abdullahi", "y.abdullahi@university.ac", "Undergraduate", "Computer Science",
    "Fingerprint-Based Attendance System", "Submission", 92, "Good", 93, 7, 6, 11000, 12000),
  makeStudent("stu-ug-019", "Elena Petrova", "e.petrova@university.ac", "Undergraduate", "Computer Science",
    "Comparative Analysis of Cloud Storage Providers", "Data Collection", 45, "Good", 90, 9, 8, 5400, 12000),
  makeStudent("stu-ug-020", "Abdul Rahman", "a.rahman@university.ac", "Undergraduate", "Computer Science",
    "AI-Powered Personal Finance Advisor", "Literature Review", 18, "Good", 96, 4, 5, 2100, 12000),

  // ── Postgraduate Students (7) ──
  makeStudent("stu-pg-001", "Amara Okafor", "amara.okafor@university.ac", "PhD", "Computer Science",
    "Federated Learning for Healthcare Data Privacy", "Analysis", 62, "Good", 91, 8, 12, 34200, 80000),
  makeStudent("stu-pg-002", "James Thornton", "james.thornton@university.ac", "Master's", "Psychology",
    "Impact of Social Media on Academic Performance Among University Students", "Writing", 78, "Warning", 74, 22, 31, 18400, 25000),
  makeStudent("stu-pg-003", "Chen Wei Lin", "chenwei.lin@university.ac", "PhD", "Economics",
    "Monetary Policy Transmission in Emerging Economies Post-COVID", "Literature Review", 22, "Good", 97, 3, 8, 11200, 80000),
  makeStudent("stu-pg-004", "Sarah Mitchell", "sarah.mitchell@university.ac", "Master's", "Education",
    "Blended Learning Effectiveness in Secondary Schools", "Submission", 95, "Critical", 62, 38, 48, 23800, 25000),
  makeStudent("stu-pg-005", "Oluwaseun Adeyemi", "o.adeyemi@university.ac", "PhD", "Computer Science",
    "Explainable AI for Medical Diagnosis Systems", "Data Collection", 30, "Good", 96, 4, 6, 24000, 80000),
  makeStudent("stu-pg-006", "Mei Ling Chow", "m.chow@university.ac", "Master's", "Data Science",
    "Predictive Modelling for University Student Retention", "Analysis", 60, "Good", 88, 12, 15, 15000, 25000),
  makeStudent("stu-pg-007", "David Ochieng", "d.ochieng@university.ac", "PhD", "Computer Science",
    "Quantum Computing Applications in Cryptographic Protocols", "Proposal", 12, "Good", 99, 2, 3, 9500, 80000),
];

// Supervisor's assigned students: 7 UG, 3 Masters, 2 PhD = 12 total
// Add notifications to these students for realistic supervisor workflow
function withNotifications(student: SupervisedStudent, notifications: StudentNotification[]): SupervisedStudent {
  return { ...student, notifications };
}

export const mockSupervisedStudents: SupervisedStudent[] = [
  // 7 Undergraduate
  withNotifications(
    makeStudent("stu-ug-001", "Fatima Al-Hassan", "fatima@university.ac", "Undergraduate", "Computer Science",
      "Effects of Urbanization on Bird Species Diversity", "Data Collection", 35, "Good", 95, 4, 5, 4800, 12000),
    [
      { id: "n1", type: "milestone", message: "Completed literature review chapter and submitted for approval", timestamp: "2 hours ago", read: false },
      { id: "n2", type: "deadline", message: "Data collection phase deadline in 5 days", timestamp: "1 day ago", read: false },
    ]
  ),
  withNotifications(
    makeStudent("stu-ug-002", "Daniel Mensah", "d.mensah@university.ac", "Undergraduate", "Computer Science",
      "Mobile App for Campus Navigation Using BLE Beacons", "Writing", 72, "Good", 89, 10, 8, 8600, 12000),
    [
      { id: "n3", type: "milestone", message: "Submitted Chapter 4 (Results) for supervisor review", timestamp: "3 hours ago", read: false },
      { id: "n4", type: "analysis-issue", message: "Statistical test selection may need revision — t-test used on non-normal data", timestamp: "1 day ago", read: false },
    ]
  ),
  withNotifications(
    makeStudent("stu-ug-003", "Priya Nair", "p.nair@university.ac", "Undergraduate", "Computer Science",
      "Sentiment Analysis of Student Feedback Using NLP", "Analysis", 55, "Good", 92, 7, 11, 6200, 12000),
    [
      { id: "n5", type: "analysis-issue", message: "Requested approval for switching from SVM to Random Forest classifier", timestamp: "5 hours ago", read: false },
    ]
  ),
  withNotifications(
    makeStudent("stu-ug-005", "Lena Kowalski", "l.kowalski@university.ac", "Undergraduate", "Computer Science",
      "Gamification in E-Learning Platforms", "Data Collection", 40, "Warning", 78, 18, 22, 4900, 12000),
    [
      { id: "n6", type: "plagiarism-risk", message: "Similarity index rose to 18% — sections flagged for review", timestamp: "4 hours ago", read: false },
      { id: "n7", type: "overdue", message: "Data collection survey deployment overdue by 3 days", timestamp: "6 hours ago", read: false },
      { id: "n8", type: "missing-data", message: "Ethics approval document not yet uploaded", timestamp: "2 days ago", read: true },
    ]
  ),
  withNotifications(
    makeStudent("stu-ug-009", "Aisha Kamara", "a.kamara@university.ac", "Undergraduate", "Computer Science",
      "Cybersecurity Awareness Among University Students", "Data Collection", 38, "Warning", 76, 20, 25, 4500, 12000),
    [
      { id: "n9", type: "plagiarism-risk", message: "AI detection score at 25% — exceeds department threshold of 20%", timestamp: "1 hour ago", read: false },
      { id: "n10", type: "overdue", message: "Literature review revision not resubmitted after 7 days", timestamp: "3 days ago", read: true },
    ]
  ),
  withNotifications(
    makeStudent("stu-ug-011", "Chiamaka Eze", "c.eze@university.ac", "Undergraduate", "Computer Science",
      "Social Media Influence on Consumer Purchasing Behaviour", "Writing", 85, "Critical", 65, 32, 40, 10200, 12000),
    [
      { id: "n11", type: "plagiarism-risk", message: "CRITICAL: Similarity index at 32% and AI detection at 40% — requires immediate supervisor action", timestamp: "30 minutes ago", read: false },
      { id: "n12", type: "analysis-issue", message: "Regression analysis results inconsistent with stated hypothesis", timestamp: "1 day ago", read: false },
      { id: "n13", type: "deadline", message: "Final submission deadline in 10 days — compliance issues unresolved", timestamp: "2 days ago", read: false },
    ]
  ),
  withNotifications(
    makeStudent("stu-ug-012", "Jun Tanaka", "j.tanaka@university.ac", "Undergraduate", "Computer Science",
      "Real-Time Traffic Monitoring Using Computer Vision", "Analysis", 58, "Good", 91, 8, 10, 6900, 12000),
    [
      { id: "n14", type: "milestone", message: "Analysis methodology section submitted for approval", timestamp: "6 hours ago", read: false },
    ]
  ),
  // 3 Master's
  withNotifications(
    makeStudent("stu-pg-002", "James Thornton", "james.thornton@university.ac", "Master's", "Psychology",
      "Impact of Social Media on Academic Performance Among University Students", "Writing", 78, "Warning", 74, 22, 31, 18400, 25000),
    [
      { id: "n15", type: "plagiarism-risk", message: "AI detection score at 31% — needs paraphrasing in Chapter 3", timestamp: "2 hours ago", read: false },
      { id: "n16", type: "milestone", message: "Draft of Discussion chapter submitted for feedback", timestamp: "1 day ago", read: false },
    ]
  ),
  withNotifications(
    makeStudent("stu-pg-004", "Sarah Mitchell", "sarah.mitchell@university.ac", "Master's", "Education",
      "Blended Learning Effectiveness in Secondary Schools", "Submission", 95, "Critical", 62, 38, 48, 23800, 25000),
    [
      { id: "n17", type: "plagiarism-risk", message: "CRITICAL: AI detection at 48% — submission cannot proceed until resolved", timestamp: "1 hour ago", read: false },
      { id: "n18", type: "milestone", message: "Final draft submitted for pre-submission review", timestamp: "3 hours ago", read: false },
      { id: "n19", type: "deadline", message: "External examiner submission deadline in 3 days", timestamp: "1 day ago", read: false },
    ]
  ),
  withNotifications(
    makeStudent("stu-pg-006", "Mei Ling Chow", "m.chow@university.ac", "Master's", "Data Science",
      "Predictive Modelling for University Student Retention", "Analysis", 60, "Good", 88, 12, 15, 15000, 25000),
    [
      { id: "n20", type: "analysis-issue", message: "Requested supervisor comment on model accuracy benchmark (89.2% vs 91%)", timestamp: "4 hours ago", read: false },
      { id: "n21", type: "milestone", message: "Feature engineering section completed and ready for review", timestamp: "1 day ago", read: true },
    ]
  ),
  // 2 PhD
  withNotifications(
    makeStudent("stu-pg-001", "Amara Okafor", "amara.okafor@university.ac", "PhD", "Computer Science",
      "Federated Learning for Healthcare Data Privacy", "Analysis", 62, "Good", 91, 8, 12, 34200, 80000),
    [
      { id: "n22", type: "milestone", message: "Published preliminary findings — journal paper draft submitted for co-author review", timestamp: "5 hours ago", read: false },
      { id: "n23", type: "analysis-issue", message: "Differential privacy parameter ε selection needs supervisor guidance", timestamp: "2 days ago", read: true },
    ]
  ),
  withNotifications(
    makeStudent("stu-pg-005", "Oluwaseun Adeyemi", "o.adeyemi@university.ac", "PhD", "Computer Science",
      "Explainable AI for Medical Diagnosis Systems", "Data Collection", 30, "Good", 96, 4, 6, 24000, 80000),
    [
      { id: "n24", type: "missing-data", message: "Hospital ethics board approval pending — data collection paused", timestamp: "1 day ago", read: false },
      { id: "n25", type: "deadline", message: "Annual progress review presentation in 14 days", timestamp: "3 days ago", read: true },
    ]
  ),
];
