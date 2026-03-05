import { SupervisedStudent, mockSupervisedStudents } from "./mockSupervisor";

export interface DepartmentSupervisor {
  id: string;
  name: string;
  email: string;
  title: string;
  specialization: string;
  studentCount: number;
  maxCapacity: number;
  students: string[]; // student IDs
  avgStudentProgress: number;
  avgIntegrityScore: number;
}

export interface SupervisorAssignment {
  studentId: string;
  supervisorId: string;
  assignedDate: string;
}

export const mockDepartmentSupervisors: DepartmentSupervisor[] = [
  {
    id: "sup-001",
    name: "Prof. Kwame Mwangi",
    email: "k.mwangi@university.ac",
    title: "Professor",
    specialization: "Machine Learning & Data Privacy",
    studentCount: 5,
    maxCapacity: 8,
    students: ["stu-ug-001", "stu-ug-002", "stu-ug-003", "stu-pg-001", "stu-pg-005"],
    avgStudentProgress: 51,
    avgIntegrityScore: 93,
  },
  {
    id: "sup-002",
    name: "Dr. Elena Rodriguez",
    email: "e.rodriguez@university.ac",
    title: "Associate Professor",
    specialization: "Educational Psychology",
    studentCount: 5,
    maxCapacity: 7,
    students: ["stu-ug-004", "stu-ug-005", "stu-ug-006", "stu-pg-002", "stu-pg-004"],
    avgStudentProgress: 48,
    avgIntegrityScore: 79,
  },
  {
    id: "sup-003",
    name: "Dr. Aisha Bello",
    email: "a.bello@university.ac",
    title: "Senior Lecturer",
    specialization: "Environmental Science",
    studentCount: 5,
    maxCapacity: 7,
    students: ["stu-ug-007", "stu-ug-008", "stu-ug-009", "stu-pg-003", "stu-pg-007"],
    avgStudentProgress: 42,
    avgIntegrityScore: 91,
  },
  {
    id: "sup-004",
    name: "Dr. Chukwuma Okafor",
    email: "c.okafor@university.ac",
    title: "Lecturer",
    specialization: "Software Engineering & Systems",
    studentCount: 5,
    maxCapacity: 6,
    students: ["stu-ug-010", "stu-ug-011", "stu-ug-012", "stu-ug-013", "stu-pg-006"],
    avgStudentProgress: 54,
    avgIntegrityScore: 86,
  },
  {
    id: "sup-005",
    name: "Prof. Ngozi Ibe",
    email: "n.ibe@university.ac",
    title: "Professor",
    specialization: "Data Science & AI Ethics",
    studentCount: 7,
    maxCapacity: 8,
    students: ["stu-ug-014", "stu-ug-015", "stu-ug-016", "stu-ug-017", "stu-ug-018", "stu-ug-019", "stu-ug-020"],
    avgStudentProgress: 42,
    avgIntegrityScore: 91,
  },
];

export const mockDepartmentStudents: SupervisedStudent[] = mockSupervisedStudents;

export interface HodDepartmentData {
  departmentName: string;
  faculty: string;
  totalStudents: number;
  totalSupervisors: number;
  avgProgress: number;
  avgIntegrity: number;
  projectsByStage: Record<string, number>;
  exportedCount: number;
}

export const mockHodDepartment: HodDepartmentData = {
  departmentName: "Computer Science",
  faculty: "Faculty of Science & Technology",
  totalStudents: 5,
  totalSupervisors: 3,
  avgProgress: 58,
  avgIntegrity: 84,
  projectsByStage: {
    "Literature Review": 1,
    "Data Collection": 1,
    "Analysis": 1,
    "Writing": 1,
    "Submission": 1,
  },
  exportedCount: 0,
};
