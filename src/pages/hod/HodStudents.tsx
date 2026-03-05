import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GraduationCap, Shield, FileText, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { mockDepartmentStudents, mockDepartmentSupervisors } from "@/data/mockHod";
import { SupervisedStudent, DegreeLevel, ProjectStage, ComplianceStatus } from "@/data/mockSupervisor";
import { toast } from "sonner";

const degreeColor: Record<string, string> = {
  Undergraduate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Master's": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  PhD: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

const UNDERGRADUATE_LEVELS = ["Undergraduate"];
const POSTGRADUATE_LEVELS = ["Master's", "PhD"];

const ALL_STAGES: ProjectStage[] = ["Proposal", "Literature Review", "Data Collection", "Analysis", "Writing", "Submission"];
const ALL_DEGREE_LEVELS: DegreeLevel[] = ["Undergraduate", "Master's", "PhD"];

interface StudentFormData {
  name: string;
  email: string;
  degreeLevel: DegreeLevel;
  projectTitle: string;
  stage: ProjectStage;
  targetWordCount: number;
}

const emptyForm: StudentFormData = {
  name: "",
  email: "",
  degreeLevel: "Undergraduate",
  projectTitle: "",
  stage: "Proposal",
  targetWordCount: 12000,
};

const StudentList = ({
  students,
  supervisors,
  onEdit,
  onDelete,
}: {
  students: SupervisedStudent[];
  supervisors: typeof mockDepartmentSupervisors;
  onEdit: (student: SupervisedStudent) => void;
  onDelete: (student: SupervisedStudent) => void;
}) => {
  const getSupervisor = (studentId: string) =>
    supervisors.find(s => s.students.includes(studentId));

  if (students.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No students in this category</p>;
  }

  return (
    <div className="space-y-3">
      {students.map(student => {
        const supervisor = getSupervisor(student.id);
        return (
          <Card key={student.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{student.name}</h3>
                  <Badge className={`text-[10px] ${degreeColor[student.degreeLevel]}`}>{student.degreeLevel}</Badge>
                  <Badge variant={student.complianceStatus === "Critical" ? "destructive" : student.complianceStatus === "Warning" ? "secondary" : "outline"} className="text-[10px]">
                    {student.complianceStatus}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{student.projectTitle}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {supervisor ? supervisor.name : "Unassigned"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Stage: {student.stage}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Integrity: {student.integrityScore}%
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2 shrink-0">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-lg font-bold text-foreground">{student.progress}%</span>
                  <Progress value={student.progress} className="w-24 h-2" />
                  <span className="text-[10px] text-muted-foreground">{student.wordCount.toLocaleString()}/{student.targetWordCount.toLocaleString()} words</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(student)}>
                      <Pencil className="h-4 w-4 mr-2" /> Edit Student
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(student)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Remove Student
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

const HodStudents = () => {
  const [students, setStudents] = useState<SupervisedStudent[]>(mockDepartmentStudents);
  const supervisors = mockDepartmentSupervisors;

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<SupervisedStudent | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<SupervisedStudent | null>(null);
  const [form, setForm] = useState<StudentFormData>(emptyForm);
  const [activeTab, setActiveTab] = useState("undergraduate");

  const undergradStudents = students.filter(s => UNDERGRADUATE_LEVELS.includes(s.degreeLevel));
  const postgradStudents = students.filter(s => POSTGRADUATE_LEVELS.includes(s.degreeLevel));

  const openAddDialog = () => {
    setEditingStudent(null);
    setForm({
      ...emptyForm,
      degreeLevel: activeTab === "postgraduate" ? "Master's" : "Undergraduate",
      targetWordCount: activeTab === "postgraduate" ? 25000 : 12000,
    });
    setFormOpen(true);
  };

  const openEditDialog = (student: SupervisedStudent) => {
    setEditingStudent(student);
    setForm({
      name: student.name,
      email: student.email,
      degreeLevel: student.degreeLevel,
      projectTitle: student.projectTitle,
      stage: student.stage,
      targetWordCount: student.targetWordCount,
    });
    setFormOpen(true);
  };

  const openDeleteDialog = (student: SupervisedStudent) => {
    setDeletingStudent(student);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim() || !form.projectTitle.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingStudent) {
      setStudents(prev =>
        prev.map(s =>
          s.id === editingStudent.id
            ? { ...s, name: form.name.trim(), email: form.email.trim(), degreeLevel: form.degreeLevel, projectTitle: form.projectTitle.trim(), stage: form.stage, targetWordCount: form.targetWordCount }
            : s
        )
      );
      toast.success(`Updated ${form.name.trim()} successfully`);
    } else {
      const newStudent: SupervisedStudent = {
        id: `stu-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        degreeLevel: form.degreeLevel,
        department: "Computer Science",
        projectTitle: form.projectTitle.trim(),
        stage: form.stage,
        progress: 0,
        complianceStatus: "Good",
        lastActivity: "Just now",
        enrolledSince: new Date().toISOString().split("T")[0],
        integrityScore: 100,
        similarityIndex: 0,
        aiDetectionScore: 0,
        wordCount: 0,
        targetWordCount: form.targetWordCount,
        stages: ALL_STAGES.map((name, i) => ({
          name,
          status: i === 0 && form.stage === "Proposal" ? "in-progress" as const : "not-started" as const,
          supervisorApproved: false,
          comments: [],
        })),
        sections: [],
        analyses: [],
        notifications: [],
        feedbackThreads: [],
      };
      setStudents(prev => [...prev, newStudent]);
      toast.success(`Added ${form.name.trim()} to department`);
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deletingStudent) {
      setStudents(prev => prev.filter(s => s.id !== deletingStudent.id));
      toast.success(`Removed ${deletingStudent.name} from department`);
    }
    setDeleteOpen(false);
    setDeletingStudent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Department Students</h1>
          <p className="text-muted-foreground text-sm">Manage students in your department and their project progress</p>
        </div>
        <Button size="sm" onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" /> Add Student
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="undergraduate">Undergraduate ({undergradStudents.length})</TabsTrigger>
          <TabsTrigger value="postgraduate">Postgraduate ({postgradStudents.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="undergraduate">
          <StudentList students={undergradStudents} supervisors={supervisors} onEdit={openEditDialog} onDelete={openDeleteDialog} />
        </TabsContent>
        <TabsContent value="postgraduate">
          <StudentList students={postgradStudents} supervisors={supervisors} onEdit={openEditDialog} onDelete={openDeleteDialog} />
        </TabsContent>
      </Tabs>

      {/* Add / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="student-name">Full Name *</Label>
              <Input id="student-name" placeholder="e.g. John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-email">Email *</Label>
              <Input id="student-email" type="email" placeholder="e.g. john@university.ac" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label>Degree Level</Label>
              <Select value={form.degreeLevel} onValueChange={(v) => setForm(f => ({ ...f, degreeLevel: v as DegreeLevel, targetWordCount: v === "Undergraduate" ? 12000 : v === "PhD" ? 80000 : 25000 }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_DEGREE_LEVELS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-project">Project Title *</Label>
              <Input id="student-project" placeholder="e.g. Impact of AI on Education" value={form.projectTitle} onChange={e => setForm(f => ({ ...f, projectTitle: e.target.value }))} maxLength={200} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Stage</Label>
                <Select value={form.stage} onValueChange={(v) => setForm(f => ({ ...f, stage: v as ProjectStage }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALL_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-words">Target Words</Label>
                <Input id="target-words" type="number" value={form.targetWordCount} onChange={e => setForm(f => ({ ...f, targetWordCount: parseInt(e.target.value) || 0 }))} min={1000} max={200000} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingStudent ? "Save Changes" : "Add Student"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deletingStudent?.name}</strong> from the departmental list? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HodStudents;
