import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, UserPlus, Users, X, GraduationCap, Building2 } from "lucide-react";
import cognitaLogo from "@/assets/cognita-logo.png";
import { DegreeLevel } from "@/data/mockSupervisor";

interface StudentEntry {
  id: string;
  name: string;
  email: string;
  degreeLevel: DegreeLevel;
  projectTitle: string;
}

const DEPARTMENTS = [
  "Computer Science", "Biology", "Psychology", "Economics", "Education",
  "Engineering", "Medicine", "Chemistry", "Environmental Science",
  "Social Sciences", "Mathematics", "Physics", "Law", "Business",
];

const SupervisorOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 — Supervisor profile
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [title, setTitle] = useState("Professor");

  // Step 2 — Add students
  const [students, setStudents] = useState<StudentEntry[]>([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDegree, setNewDegree] = useState<DegreeLevel>("PhD");
  const [newProject, setNewProject] = useState("");

  const addStudent = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    setStudents(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: newName, email: newEmail, degreeLevel: newDegree, projectTitle: newProject },
    ]);
    setNewName("");
    setNewEmail("");
    setNewProject("");
  };

  const removeStudent = (id: string) => setStudents(prev => prev.filter(s => s.id !== id));

  const handleFinish = () => navigate("/supervisor/students");

  const degreeColor: Record<DegreeLevel, string> = {
    Undergraduate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    "Master's": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    PhD: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  };

  const steps = [
    { num: 1, label: "Your Profile" },
    { num: 2, label: "Add Students" },
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

          {/* ── Step 2: Add Students ── */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Add Your Students</h2>
              </div>
              <p className="text-sm text-muted-foreground -mt-2">Add students you currently supervise. You can always add more later.</p>

              {/* Added students list */}
              {students.length > 0 && (
                <div className="space-y-2">
                  {students.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-center gap-3 min-w-0">
                        <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{s.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                        </div>
                        <Badge className={`text-[10px] shrink-0 ${degreeColor[s.degreeLevel]}`}>{s.degreeLevel}</Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeStudent(s.id)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add student form */}
              <div className="border border-dashed border-border rounded-lg p-4 space-y-3 bg-card">
                <p className="text-sm font-medium flex items-center gap-2"><UserPlus className="h-4 w-4 text-primary" /> New Student</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Full Name</Label>
                    <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Student name" />
                  </div>
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="student@university.ac" />
                  </div>
                  <div>
                    <Label className="text-xs">Degree Level</Label>
                    <Select value={newDegree} onValueChange={v => setNewDegree(v as DegreeLevel)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="Master's">Master's</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Project Title (optional)</Label>
                    <Input value={newProject} onChange={e => setNewProject(e.target.value)} placeholder="Research project title" />
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={addStudent} disabled={!newName.trim() || !newEmail.trim()}>
                  <UserPlus className="h-3.5 w-3.5 mr-2" /> Add Student
                </Button>
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
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Students ({students.length})</h3>
                {students.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No students added yet. You can add them later from your dashboard.</p>
                ) : (
                  <div className="space-y-2">
                    {students.map(s => (
                      <div key={s.id} className="flex items-center gap-3 text-sm">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{s.name}</span>
                        <Badge className={`text-[10px] ${degreeColor[s.degreeLevel]}`}>{s.degreeLevel}</Badge>
                        {s.projectTitle && <span className="text-muted-foreground truncate hidden sm:inline">— {s.projectTitle}</span>}
                      </div>
                    ))}
                  </div>
                )}
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
    </div>
  );
};

export default SupervisorOnboarding;
