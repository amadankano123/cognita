import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Users, GraduationCap, Building2, Eye, Pencil, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import cognitaLogo from "@/assets/cognita-logo.png";
import { mockSupervisedStudents, type SupervisedStudent, type DegreeLevel } from "@/data/mockSupervisor";
import { toast } from "sonner";

const DEPARTMENTS = [
  "Computer Science", "Biology", "Psychology", "Economics", "Education",
  "Engineering", "Medicine", "Chemistry", "Environmental Science",
  "Social Sciences", "Mathematics", "Physics", "Law", "Business",
];

const degreeColor: Record<DegreeLevel, string> = {
  Undergraduate: "bg-accent text-accent-foreground",
  "Master's": "bg-primary/10 text-primary",
  PhD: "bg-primary/20 text-primary",
};

const SupervisorOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 — Supervisor profile
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [title, setTitle] = useState("Professor");

  // Step 2 — View & verify students (assigned by HOD)
  const [students, setStudents] = useState<SupervisedStudent[]>(mockSupervisedStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<SupervisedStudent | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", degreeLevel: "" as DegreeLevel, projectTitle: "" });

  const openEdit = (student: SupervisedStudent) => {
    setEditingStudent(student);
    setEditForm({ name: student.name, email: student.email, degreeLevel: student.degreeLevel, projectTitle: student.projectTitle });
    setEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (!editingStudent) return;
    setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...editForm } : s));
    setEditDialogOpen(false);
    toast.success(`Updated ${editForm.name}'s information`);
  };

  const filteredStudents = students.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.projectTitle.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  const ugCount = students.filter(s => s.degreeLevel === "Undergraduate").length;
  const mastersCount = students.filter(s => s.degreeLevel === "Master's").length;
  const phdCount = students.filter(s => s.degreeLevel === "PhD").length;

  const handleFinish = () => navigate("/supervisor/students");

  const steps = [
    { num: 1, label: "Your Profile" },
    { num: 2, label: "Verify Students" },
    { num: 3, label: "Review & Start" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="h-14 border-b border-border flex items-center px-6 bg-card">
        <img src={cognitaLogo} alt="Cognita" className="h-8 w-8 rounded-md object-cover mr-2" />
        <span className="font-display text-lg font-semibold tracking-tight">Cognita</span>
        <Badge variant="outline" className="ml-3 text-xs">Supervisor Setup</Badge>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome, Supervisor</h1>
        <p className="text-muted-foreground text-center mb-8">Set up your supervision workspace in 3 steps.</p>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map(s => (
            <div key={s.num} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step >= s.num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">{s.label}</span>
              </div>
              {s.num < 3 && <div className={`w-16 h-0.5 mb-5 sm:mb-0 ${step > s.num ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <Card className="p-6 shadow-card">
          {/* ── Step 1: Supervisor Profile ── */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Your Academic Profile</h2>
              </div>

              <div>
                <Label>Academic Title</Label>
                <Select value={title} onValueChange={setTitle}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Professor", "Associate Professor", "Assistant Professor", "Senior Lecturer", "Lecturer", "Dr."].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Research Specialization</Label>
                <Input value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="e.g. Machine Learning, Molecular Biology" />
              </div>
            </div>
          )}

          {/* ── Step 2: View, Verify & Edit Assigned Students ── */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Verify Assigned Students</h2>
              </div>
              <p className="text-sm text-muted-foreground -mt-2">
                The following students have been assigned to you by the Head of Department. Please verify their information and edit if needed.
              </p>

              {/* Summary badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">{ugCount} Undergraduate</Badge>
                <Badge variant="secondary" className="text-xs">{mastersCount} Master's</Badge>
                <Badge variant="secondary" className="text-xs">{phdCount} PhD</Badge>
                <Badge variant="outline" className="text-xs">{students.length} Total</Badge>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, email, or project..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>

              {/* Student list */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {filteredStudents.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{s.name}</p>
                          <Badge className={`text-[10px] shrink-0 ${degreeColor[s.degreeLevel]}`}>{s.degreeLevel}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{s.projectTitle}</p>
                        <p className="text-xs text-muted-foreground/70 truncate">{s.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 gap-1 text-xs" onClick={() => openEdit(s)}>
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                  </div>
                ))}
                {filteredStudents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No students match your search.</p>
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: Review ── */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Check className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Review & Start</h2>
              </div>

              <div className="rounded-lg border border-border p-4 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Your Profile</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Title</span><span className="font-medium">{title}</span>
                  <span className="text-muted-foreground">Department</span><span className="font-medium">{department || "—"}</span>
                  <span className="text-muted-foreground">Specialization</span><span className="font-medium">{specialization || "—"}</span>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Assigned Students ({students.length})</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{ugCount} UG</Badge>
                  <Badge variant="secondary" className="text-xs">{mastersCount} Master's</Badge>
                  <Badge variant="secondary" className="text-xs">{phdCount} PhD</Badge>
                </div>
                <div className="space-y-2 max-h-[240px] overflow-y-auto">
                  {students.map(s => (
                    <div key={s.id} className="flex items-center gap-3 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">{s.name}</span>
                      <Badge className={`text-[10px] ${degreeColor[s.degreeLevel]}`}>{s.degreeLevel}</Badge>
                      <span className="text-muted-foreground truncate hidden sm:inline text-xs">— {s.projectTitle}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => step === 1 ? navigate("/auth") : setStep(step - 1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !department}>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleFinish}>
                Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Full Name</Label>
              <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <Label>Degree Level</Label>
              <Select value={editForm.degreeLevel} onValueChange={v => setEditForm(f => ({ ...f, degreeLevel: v as DegreeLevel }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="Master's">Master's</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Project Title</Label>
              <Input value={editForm.projectTitle} onChange={e => setEditForm(f => ({ ...f, projectTitle: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={!editForm.name.trim()}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupervisorOnboarding;
