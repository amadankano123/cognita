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

export const mockSupervisedStudents: SupervisedStudent[] = [
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
