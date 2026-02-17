import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Check, BookOpen, FileText, GraduationCap, ScrollText, BookMarked, FlaskConical } from "lucide-react";
import cognitaLogo from "@/assets/cognita-logo.jpeg";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("AI-Based Early Detection of Crop Diseases Using Computer Vision");
  const [discipline, setDiscipline] = useState("Computer Science");
  const [outputType, setOutputType] = useState("journal");
  const [methodology, setMethodology] = useState("quantitative");
  const [targetJournal, setTargetJournal] = useState("Computers and Electronics in Agriculture");
  const [template, setTemplate] = useState("journal");

  const handleCreate = () => navigate("/app/proj-001/dashboard");

  const templates = [
    { id: "proposal", label: "Research Proposal", desc: "Standard academic proposal structure", icon: FileText },
    { id: "progress-report", label: "Progress Report", desc: "Periodic research progress update", icon: ScrollText },
    { id: "thesis", label: "Thesis", desc: "Full thesis with chapters", icon: GraduationCap },
    { id: "dissertation", label: "Dissertation", desc: "Comprehensive dissertation format", icon: BookMarked },
    { id: "journal", label: "Journal Article", desc: "IMRaD structure for journal submission", icon: FlaskConical },
    { id: "grant", label: "Grant Application", desc: "Grant-specific sections with budget", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-14 border-b border-border flex items-center px-6 bg-card">
        <img src={cognitaLogo} alt="Cognita" className="h-8 w-8 rounded-md object-cover mr-2" />
        <span className="font-display text-lg font-semibold tracking-tight">Cognita</span>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-2">Create a New Project</h1>
        <p className="text-muted-foreground text-center mb-8">Set up your research project in 3 easy steps.</p>
        <div className="flex items-center justify-center gap-2 mb-8">
          {[{ num: 1, label: "Project Details" }, { num: 2, label: "Choose Template" }, { num: 3, label: "Import References" }].map(s => (
            <div key={s.num} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step >= s.num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{step > s.num ? <Check className="h-4 w-4" /> : s.num}</div>
                <span className="text-xs text-muted-foreground hidden sm:block">{s.label}</span>
              </div>
              {s.num < 3 && <div className={`w-16 h-0.5 mb-5 sm:mb-0 ${step > s.num ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
        <Card className="p-6 shadow-card">
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-xl font-semibold mb-4">Project Details</h2>
              <div><Label htmlFor="title">Project Title</Label><Input id="title" value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div><Label>Discipline</Label><Select value={discipline} onValueChange={setDiscipline}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Computer Science">Computer Science</SelectItem><SelectItem value="Biology">Biology</SelectItem><SelectItem value="Medicine">Medicine</SelectItem><SelectItem value="Engineering">Engineering</SelectItem><SelectItem value="Environmental Science">Environmental Science</SelectItem><SelectItem value="Social Sciences">Social Sciences</SelectItem><SelectItem value="Chemistry">Chemistry</SelectItem></SelectContent></Select></div>
              <div><Label>Output Type</Label><RadioGroup value={outputType} onValueChange={setOutputType} className="grid grid-cols-2 gap-2 mt-2"><div className="flex items-center gap-2"><RadioGroupItem value="thesis" id="ot-th" /><Label htmlFor="ot-th" className="font-normal">Thesis</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="dissertation" id="ot-d" /><Label htmlFor="ot-d" className="font-normal">Dissertation</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="journal" id="ot-j" /><Label htmlFor="ot-j" className="font-normal">Journal Paper</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="proposal" id="ot-p" /><Label htmlFor="ot-p" className="font-normal">Proposal</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="progress-report" id="ot-pr" /><Label htmlFor="ot-pr" className="font-normal">Progress Report</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="grant" id="ot-g" /><Label htmlFor="ot-g" className="font-normal">Grant Application</Label></div></RadioGroup></div>
              <div><Label>Methodology</Label><RadioGroup value={methodology} onValueChange={setMethodology} className="flex gap-4 mt-2"><div className="flex items-center gap-2"><RadioGroupItem value="quantitative" id="m-qt" /><Label htmlFor="m-qt" className="font-normal">Quantitative</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="qualitative" id="m-ql" /><Label htmlFor="m-ql" className="font-normal">Qualitative</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="mixed" id="m-mx" /><Label htmlFor="m-mx" className="font-normal">Mixed</Label></div></RadioGroup></div>
              <div><Label>Target Journal</Label><Input value={targetJournal} onChange={e => setTargetJournal(e.target.value)} /></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-xl font-semibold mb-4">Choose a Template</h2>
              <div className="grid gap-3">{templates.map(t => (<button key={t.id} onClick={() => setTemplate(t.id)} className={`p-4 rounded-lg border-2 text-left transition-all flex items-start gap-3 ${template === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}><t.icon className={`h-5 w-5 mt-0.5 shrink-0 ${template === t.id ? "text-primary" : "text-muted-foreground"}`} /><div><p className="font-medium text-sm">{t.label}</p><p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p></div></button>))}</div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-xl font-semibold mb-4">Import References</h2>
              <p className="text-sm text-muted-foreground">Optionally import references to get started.</p>
              <div className="grid gap-3">
                <button onClick={handleCreate} className="p-5 rounded-lg border-2 border-primary bg-primary/5 text-left flex items-center gap-4 hover:bg-primary/10 transition-colors"><BookOpen className="h-8 w-8 text-primary shrink-0" /><div><p className="font-medium">Import Demo References</p><p className="text-xs text-muted-foreground mt-0.5">Load 12 sample references</p></div></button>
                <button onClick={handleCreate} className="p-5 rounded-lg border-2 border-border text-left flex items-center gap-4 hover:border-primary/30 transition-colors"><div><p className="font-medium">Skip — add references later</p><p className="text-xs text-muted-foreground mt-0.5">Import from DOI or BibTeX anytime</p></div></button>
              </div>
            </div>
          )}
          <div className="flex justify-between mt-8 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => step === 1 ? navigate("/auth") : setStep(step - 1)}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            {step < 3 ? <Button onClick={() => setStep(step + 1)}>Next <ArrowRight className="h-4 w-4 ml-2" /></Button> : <Button onClick={handleCreate}>Create Project <Check className="h-4 w-4 ml-2" /></Button>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
