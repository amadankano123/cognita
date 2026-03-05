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
    studentCount: 3,
    maxCapacity: 5,
    students: ["stu-001", "stu-003", "stu-004"],
    avgStudentProgress: 40,
    avgIntegrityScore: 94,
  },
  {
    id: "sup-002",
    name: "Dr. Elena Rodriguez",
    email: "e.rodriguez@university.ac",
    title: "Associate Professor",
    specialization: "Educational Psychology",
    studentCount: 2,
    maxCapacity: 4,
    students: ["stu-002", "stu-005"],
    avgStudentProgress: 87,
    avgIntegrityScore: 68,
  },
  {
    id: "sup-003",
    name: "Dr. Aisha Bello",
    email: "a.bello@university.ac",
    title: "Senior Lecturer",
    specialization: "Environmental Science",
    studentCount: 0,
    maxCapacity: 3,
    students: [],
    avgStudentProgress: 0,
    avgIntegrityScore: 0,
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
