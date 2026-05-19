// Accountability flags shared across Student / Supervisor / HOD / Admin dashboards.
// Covers three engines:
//   1. Student Inactivity (Stagnation) Monitoring
//   2. Supervisor Responsiveness Tracking
//   3. Deadline Compliance Engine

export type FlagCategory = "inactivity" | "supervisor-responsiveness" | "deadline";
export type FlagSeverity = "info" | "warning" | "critical";
export type FlagStatus = "open" | "reminded" | "escalated" | "resolved";

export interface AccountabilityFlag {
  id: string;
  category: FlagCategory;
  severity: FlagSeverity;
  status: FlagStatus;
  title: string;
  detail: string;
  // Subjects
  studentId?: string;
  studentName?: string;
  supervisorId?: string;
  supervisorName?: string;
  department?: string;
  // Engine context
  rule: string;            // human-readable rule that fired the flag
  daysOverdue: number;     // 0 if just triggered
  milestone?: string;      // e.g. "Chapter 3 Submission", "Proposal Defense"
  createdAt: string;       // ISO date
  remindersSent: number;
  escalatedTo?: string;    // "Supervisor" | "HOD" | "PG Coordinator"
}

// Institution-wide thresholds (admin/HOD configurable in the real product).
export const flagThresholds = {
  inactivity: {
    noLoginDays: 7,
    noChapterUpdateWeeks: 2,
    noResponseToCommentsDays: 5,
  },
  supervisorResponse: {
    chapterReviewDays: 7,
    proposalReviewDays: 10,
    correctionReviewDays: 5,
    meetingResponseDays: 3,
    ethicsClearanceDays: 10,
    escalateAfterDays: 3, // extra days past deadline before escalation
  },
  deadlines: {
    maxExtensionsAllowed: 2,
    longPendingApprovalDays: 14,
  },
};

export const mockAccountabilityFlags: AccountabilityFlag[] = [
  // ── Student Inactivity ───────────────────────────────────────────────
  {
    id: "flg-001",
    category: "inactivity",
    severity: "critical",
    status: "escalated",
    title: "No login activity for 14 days",
    detail: "Student has not signed in since 5 May 2026. Two reminders sent.",
    studentId: "stu-pg-002",
    studentName: "Amara Okonkwo",
    supervisorName: "Dr. Elena Rodriguez",
    department: "Computer Science",
    rule: "No login activity for >7 days",
    daysOverdue: 7,
    createdAt: "2026-05-12",
    remindersSent: 2,
    escalatedTo: "HOD",
  },
  {
    id: "flg-002",
    category: "inactivity",
    severity: "warning",
    status: "reminded",
    title: "No chapter update for 3 weeks",
    detail: "Last edit on Chapter 2 was 28 April 2026.",
    studentId: "stu-ug-004",
    studentName: "Liam Carter",
    supervisorName: "Dr. Elena Rodriguez",
    department: "Computer Science",
    rule: "No chapter update for >2 weeks",
    daysOverdue: 7,
    milestone: "Chapter 2: Literature Review",
    createdAt: "2026-05-13",
    remindersSent: 1,
  },
  {
    id: "flg-003",
    category: "inactivity",
    severity: "warning",
    status: "open",
    title: "Unanswered supervisor comments",
    detail: "5 unread comments on Methodology section pending student response.",
    studentId: "stu-ug-007",
    studentName: "Zainab Adeleke",
    supervisorName: "Dr. Aisha Bello",
    department: "Computer Science",
    rule: "No response to supervisor comments for >5 days",
    daysOverdue: 3,
    createdAt: "2026-05-16",
    remindersSent: 0,
  },

  // ── Supervisor Responsiveness ────────────────────────────────────────
  {
    id: "flg-004",
    category: "supervisor-responsiveness",
    severity: "critical",
    status: "escalated",
    title: "Supervisor Negligence — Chapter review overdue 11 days",
    detail: "Chapter 3 submitted 8 May, response SLA was 7 days. Escalated to HOD.",
    studentId: "stu-pg-001",
    studentName: "Tunde Balogun",
    supervisorId: "sup-001",
    supervisorName: "Prof. Kwame Mwangi",
    department: "Computer Science",
    rule: "Supervisor must respond to chapter within 7 days",
    daysOverdue: 11,
    milestone: "Chapter 3 Submission",
    createdAt: "2026-05-15",
    remindersSent: 4,
    escalatedTo: "HOD",
  },
  {
    id: "flg-005",
    category: "supervisor-responsiveness",
    severity: "warning",
    status: "reminded",
    title: "Proposal feedback overdue",
    detail: "Proposal submitted 9 May. SLA 10 days. Daily reminders active.",
    studentId: "stu-pg-005",
    studentName: "Fatima Diallo",
    supervisorId: "sup-001",
    supervisorName: "Prof. Kwame Mwangi",
    department: "Computer Science",
    rule: "Supervisor must respond to proposal within 10 days",
    daysOverdue: 1,
    milestone: "Proposal Review",
    createdAt: "2026-05-18",
    remindersSent: 1,
  },
  {
    id: "flg-006",
    category: "supervisor-responsiveness",
    severity: "info",
    status: "open",
    title: "Meeting request unanswered",
    detail: "Student requested a check-in meeting 3 days ago.",
    studentId: "stu-ug-011",
    studentName: "Ibrahim Sani",
    supervisorId: "sup-004",
    supervisorName: "Dr. Chukwuma Okafor",
    department: "Computer Science",
    rule: "Supervisor must respond to meeting request within 3 days",
    daysOverdue: 0,
    createdAt: "2026-05-16",
    remindersSent: 0,
  },
  {
    id: "flg-007",
    category: "supervisor-responsiveness",
    severity: "warning",
    status: "open",
    title: "Ethical clearance request pending",
    detail: "Ethics review form submitted 6 May, awaiting supervisor sign-off.",
    studentId: "stu-pg-007",
    studentName: "Chioma Eze",
    supervisorId: "sup-003",
    supervisorName: "Dr. Aisha Bello",
    department: "Computer Science",
    rule: "Supervisor must endorse ethics clearance within 10 days",
    daysOverdue: 3,
    milestone: "Ethics Clearance",
    createdAt: "2026-05-16",
    remindersSent: 1,
  },

  // ── Deadline Compliance ──────────────────────────────────────────────
  {
    id: "flg-008",
    category: "deadline",
    severity: "critical",
    status: "escalated",
    title: "Missed deadline — Data Collection phase",
    detail: "Phase was due 1 May. No submission received. Escalated to PG Coordinator.",
    studentId: "stu-pg-003",
    studentName: "Kofi Mensah",
    supervisorName: "Dr. Aisha Bello",
    department: "Computer Science",
    rule: "Milestone deadline exceeded",
    daysOverdue: 18,
    milestone: "Data Collection",
    createdAt: "2026-05-02",
    remindersSent: 3,
    escalatedTo: "PG Coordinator",
  },
  {
    id: "flg-009",
    category: "deadline",
    severity: "warning",
    status: "open",
    title: "Repeated deadline extensions (3)",
    detail: "Student has requested 3 extensions on Chapter 4. Cap is 2.",
    studentId: "stu-pg-004",
    studentName: "Sofia Petrova",
    supervisorName: "Dr. Elena Rodriguez",
    department: "Computer Science",
    rule: "More than 2 extensions on the same milestone",
    daysOverdue: 5,
    milestone: "Chapter 4 Submission",
    createdAt: "2026-05-14",
    remindersSent: 1,
  },
  {
    id: "flg-010",
    category: "deadline",
    severity: "warning",
    status: "reminded",
    title: "Long pending approval — Topic Approval",
    detail: "Awaiting HOD approval for 16 days.",
    studentId: "stu-ug-014",
    studentName: "Maya Johnson",
    supervisorName: "Prof. Ngozi Ibe",
    department: "Computer Science",
    rule: "Approval pending for >14 days",
    daysOverdue: 2,
    milestone: "Topic Approval",
    createdAt: "2026-05-03",
    remindersSent: 2,
    escalatedTo: "HOD",
  },
  {
    id: "flg-011",
    category: "deadline",
    severity: "info",
    status: "open",
    title: "Upcoming: Viva preparation in 7 days",
    detail: "Final viva scheduled 26 May. Prep checklist not yet started.",
    studentId: "stu-pg-006",
    studentName: "David Park",
    supervisorName: "Dr. Chukwuma Okafor",
    department: "Computer Science",
    rule: "Milestone approaching",
    daysOverdue: 0,
    milestone: "Viva Preparation",
    createdAt: "2026-05-19",
    remindersSent: 0,
  },
];

// Convenience selectors
export const getFlagsForStudent = (studentId: string) =>
  mockAccountabilityFlags.filter(f => f.studentId === studentId);

export const getFlagsForSupervisor = (supervisorId: string) =>
  mockAccountabilityFlags.filter(
    f =>
      f.supervisorId === supervisorId ||
      // Show inactivity / deadline flags for students under this supervisor too
      (f.category !== "supervisor-responsiveness" && f.supervisorId === undefined),
  );

export const getFlagsByCategory = (category: FlagCategory) =>
  mockAccountabilityFlags.filter(f => f.category === category);

export const flagCategoryLabel: Record<FlagCategory, string> = {
  inactivity: "Student Inactivity",
  "supervisor-responsiveness": "Supervisor Responsiveness",
  deadline: "Deadline Compliance",
};
