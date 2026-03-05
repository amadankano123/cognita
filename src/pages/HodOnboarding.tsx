import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Building2, Users } from "lucide-react";
import cognitaLogo from "@/assets/cognita-logo.png";

const FACULTIES = [
  "Faculty of Science & Technology",
  "Faculty of Arts & Humanities",
  "Faculty of Social Sciences",
  "Faculty of Medicine & Health",
  "Faculty of Engineering",
  "Faculty of Education",
  "Faculty of Law",
  "Faculty of Business & Economics",
];

const DEPARTMENTS = [
  "Computer Science", "Biology", "Psychology", "Economics", "Education",
  "Engineering", "Medicine", "Chemistry", "Environmental Science",
  "Social Sciences", "Mathematics", "Physics", "Law", "Business",
];

const HodOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("Professor");
  const [maxPerSupervisor, setMaxPerSupervisor] = useState("5");
  const [similarityThreshold, setSimilarityThreshold] = useState("25");
  const [aiDetectionThreshold, setAiDetectionThreshold] = useState("30");

  const steps = [
    { num: 1, label: "Department Info" },
    { num: 2, label: "Policies" },
    { num: 3, label: "Review & Start" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-14 border-b border-border flex items-center px-6 bg-card">
        <img src={cognitaLogo} alt="Cognita" className="h-8 w-8 rounded-md object-cover mr-2" />
        <span className="font-display text-lg font-semibold tracking-tight">Cognita</span>
        <Badge variant="outline" className="ml-3 text-xs">HOD Setup</Badge>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome, Head of Department</h1>
        <p className="text-muted-foreground text-center mb-8">Set up your departmental workspace in 3 steps.</p>

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
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Department Information</h2>
              </div>
              <div>
                <Label>Academic Title</Label>
                <Select value={title} onValueChange={setTitle}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Professor", "Associate Professor", "Dr."].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Faculty</Label>
                <Select value={faculty} onValueChange={setFaculty}>
                  <SelectTrigger><SelectValue placeholder="Select faculty" /></SelectTrigger>
                  <SelectContent>
                    {FACULTIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
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
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Department Policies</h2>
              </div>
              <div>
                <Label>Max Students per Supervisor</Label>
                <Input type="number" value={maxPerSupervisor} onChange={e => setMaxPerSupervisor(e.target.value)} />
              </div>
              <div>
                <Label>Similarity Index Threshold (%)</Label>
                <Input type="number" value={similarityThreshold} onChange={e => setSimilarityThreshold(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">Students exceeding this will be flagged as Warning</p>
              </div>
              <div>
                <Label>AI Detection Threshold (%)</Label>
                <Input type="number" value={aiDetectionThreshold} onChange={e => setAiDetectionThreshold(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">Maximum acceptable AI-generated content percentage</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Check className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Review & Start</h2>
              </div>
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Department Setup</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Title</span><span className="font-medium">{title}</span>
                  <span className="text-muted-foreground">Faculty</span><span className="font-medium">{faculty || "—"}</span>
                  <span className="text-muted-foreground">Department</span><span className="font-medium">{department || "—"}</span>
                  <span className="text-muted-foreground">Max Students/Supervisor</span><span className="font-medium">{maxPerSupervisor}</span>
                  <span className="text-muted-foreground">Similarity Threshold</span><span className="font-medium">{similarityThreshold}%</span>
                  <span className="text-muted-foreground">AI Detection Threshold</span><span className="font-medium">{aiDetectionThreshold}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => step === 1 ? navigate("/auth") : setStep(step - 1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={step === 1 && (!faculty || !department)}>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={() => navigate("/hod/overview")}>
                Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HodOnboarding;
