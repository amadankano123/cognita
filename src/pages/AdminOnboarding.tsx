import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, ArrowRight, Check, Building2, GraduationCap, Users, X,
  Plus, BookOpen, Landmark,
} from "lucide-react";
import cognitaLogo from "@/assets/cognita-logo.png";

/* ── Degree catalogue ── */
const DEGREE_CATEGORIES = [
  {
    label: "Pre-Degree / Certificate",
    degrees: ["NCE", "Diploma", "Higher Diploma (HD)", "Certificate"],
  },
  {
    label: "Undergraduate",
    degrees: ["B.Sc", "B.A", "B.Eng", "B.Ed", "B.Tech", "LLB"],
  },
  {
    label: "Postgraduate",
    degrees: ["PGD", "M.Sc", "M.A", "M.Eng", "M.Ed", "MBA", "LLM", "PhD"],
  },
];

interface FacultyEntry {
  id: string;
  name: string;
  departments: string[];
}

const AdminOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 — Institution basics
  const [instName, setInstName] = useState("");
  const [instType, setInstType] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");

  // Step 2 — Degrees offered
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);

  const toggleDegree = (d: string) =>
    setSelectedDegrees((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  // Step 3 — Faculties & Departments
  const [faculties, setFaculties] = useState<FacultyEntry[]>([]);
  const [newFacultyName, setNewFacultyName] = useState("");
  const [newDeptName, setNewDeptName] = useState("");
  const [activeFacultyId, setActiveFacultyId] = useState<string | null>(null);

  const addFaculty = () => {
    if (!newFacultyName.trim()) return;
    const f: FacultyEntry = { id: crypto.randomUUID(), name: newFacultyName.trim(), departments: [] };
    setFaculties((prev) => [...prev, f]);
    setActiveFacultyId(f.id);
    setNewFacultyName("");
  };

  const removeFaculty = (id: string) => {
    setFaculties((prev) => prev.filter((f) => f.id !== id));
    if (activeFacultyId === id) setActiveFacultyId(null);
  };

  const addDepartment = () => {
    if (!newDeptName.trim() || !activeFacultyId) return;
    setFaculties((prev) =>
      prev.map((f) =>
        f.id === activeFacultyId ? { ...f, departments: [...f.departments, newDeptName.trim()] } : f
      )
    );
    setNewDeptName("");
  };

  const removeDept = (fId: string, dept: string) =>
    setFaculties((prev) =>
      prev.map((f) =>
        f.id === fId ? { ...f, departments: f.departments.filter((d) => d !== dept) } : f
      )
    );

  const handleFinish = () => navigate("/admin/dashboard");

  const steps = [
    { num: 1, label: "Institution Info" },
    { num: 2, label: "Degrees Offered" },
    { num: 3, label: "Faculties & Depts" },
    { num: 4, label: "Review & Start" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-14 border-b border-border flex items-center px-6 bg-card">
        <img src={cognitaLogo} alt="Cognita" className="h-8 w-8 rounded-md object-cover mr-2" />
        <span className="font-display text-lg font-semibold tracking-tight">Cognita</span>
        <Badge variant="outline" className="ml-3 text-xs">Admin Setup</Badge>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-2">Set Up Your Institution</h1>
        <p className="text-muted-foreground text-center mb-8">
          Configure your institution's profile in {steps.length} steps.
        </p>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {steps.map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    step >= s.num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">{s.label}</span>
              </div>
              {s.num < steps.length && (
                <div className={`w-10 sm:w-16 h-0.5 mb-5 sm:mb-0 ${step > s.num ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="p-6 shadow-card">
          {/* ── Step 1: Institution Info ── */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Institution Information</h2>
              </div>
              <div>
                <Label>Institution Name</Label>
                <Input value={instName} onChange={(e) => setInstName(e.target.value)} placeholder="e.g. Greenfield University" />
              </div>
              <div>
                <Label>Institution Type</Label>
                <Select value={instType} onValueChange={setInstType}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {["University", "Polytechnic", "College of Education", "Monotechnic", "Research Institute", "Other"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Country</Label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Nigeria" />
              </div>
              <div>
                <Label>Website (optional)</Label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
              </div>
            </div>
          )}

          {/* ── Step 2: Degrees Offered ── */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Degrees Offered</h2>
              </div>
              <p className="text-sm text-muted-foreground -mt-2">Select all degree programmes your institution offers.</p>

              {DEGREE_CATEGORIES.map((cat) => (
                <div key={cat.label} className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{cat.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.degrees.map((d) => {
                      const selected = selectedDegrees.includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() => toggleDegree(d)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                            selected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/40 text-foreground border-border hover:border-primary/50"
                          }`}
                        >
                          {selected && <Check className="h-3 w-3 inline mr-1" />}
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {selectedDegrees.length > 0 && (
                <p className="text-sm text-primary font-medium">{selectedDegrees.length} degree(s) selected</p>
              )}
            </div>
          )}

          {/* ── Step 3: Faculties & Departments ── */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Faculties & Departments</h2>
              </div>
              <p className="text-sm text-muted-foreground -mt-2">
                Add your faculties first, then add departments under each one.
              </p>

              {/* Add faculty */}
              <div className="flex gap-2">
                <Input
                  value={newFacultyName}
                  onChange={(e) => setNewFacultyName(e.target.value)}
                  placeholder="Faculty name, e.g. Faculty of Science"
                  onKeyDown={(e) => e.key === "Enter" && addFaculty()}
                />
                <Button variant="outline" size="sm" onClick={addFaculty} disabled={!newFacultyName.trim()}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              {/* Faculty list */}
              {faculties.length > 0 && (
                <div className="space-y-3">
                  {faculties.map((f) => (
                    <div key={f.id} className={`rounded-lg border p-4 space-y-3 transition-colors ${activeFacultyId === f.id ? "border-primary bg-primary/5" : "border-border"}`}>
                      <div className="flex items-center justify-between">
                        <button onClick={() => setActiveFacultyId(f.id)} className="font-medium text-sm flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          {f.name}
                          <Badge variant="secondary" className="text-[10px]">{f.departments.length} dept(s)</Badge>
                        </button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFaculty(f.id)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Departments */}
                      {f.departments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pl-6">
                          {f.departments.map((d) => (
                            <Badge key={d} variant="outline" className="text-xs gap-1">
                              {d}
                              <button onClick={() => removeDept(f.id, d)} className="hover:text-destructive">
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Add department to this faculty */}
                      {activeFacultyId === f.id && (
                        <div className="flex gap-2 pl-6">
                          <Input
                            value={newDeptName}
                            onChange={(e) => setNewDeptName(e.target.value)}
                            placeholder="Department name"
                            className="h-8 text-sm"
                            onKeyDown={(e) => e.key === "Enter" && addDepartment()}
                          />
                          <Button variant="outline" size="sm" className="h-8" onClick={addDepartment} disabled={!newDeptName.trim()}>
                            <Plus className="h-3 w-3 mr-1" /> Dept
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Step 4: Review ── */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Check className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Review & Start</h2>
              </div>

              {/* Institution */}
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Institution</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Name</span><span className="font-medium">{instName || "—"}</span>
                  <span className="text-muted-foreground">Type</span><span className="font-medium">{instType || "—"}</span>
                  <span className="text-muted-foreground">Country</span><span className="font-medium">{country || "—"}</span>
                  {website && (<><span className="text-muted-foreground">Website</span><span className="font-medium truncate">{website}</span></>)}
                </div>
              </div>

              {/* Degrees */}
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Degrees Offered ({selectedDegrees.length})
                </h3>
                {selectedDegrees.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No degrees selected.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDegrees.map((d) => (
                      <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Faculties */}
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Faculties ({faculties.length})
                </h3>
                {faculties.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No faculties added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {faculties.map((f) => (
                      <div key={f.id} className="text-sm">
                        <p className="font-medium flex items-center gap-2">
                          <BookOpen className="h-3.5 w-3.5 text-primary" /> {f.name}
                        </p>
                        {f.departments.length > 0 && (
                          <p className="text-xs text-muted-foreground ml-5 mt-0.5">
                            {f.departments.join(" · ")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => (step === 1 ? navigate("/auth") : setStep(step - 1))}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !instName.trim()}>
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

export default AdminOnboarding;
