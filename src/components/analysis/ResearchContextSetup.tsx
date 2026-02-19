import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FlaskConical, Target, Variable, ChevronRight, Check, Info } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

interface ResearchContext {
  researchType: string;
  studyDesign: string;
  researchQuestion: string;
  hypotheses: string;
  variables: { name: string; type: string; role: string }[];
}

interface Props {
  context: ResearchContext;
  onChange: (ctx: ResearchContext) => void;
  onComplete: () => void;
}

const STUDY_DESIGNS: Record<string, string[]> = {
  quantitative: ["Experimental", "Quasi-Experimental", "Survey", "Correlational", "Longitudinal", "Cross-Sectional"],
  qualitative: ["Case Study", "Phenomenological", "Grounded Theory", "Ethnography", "Narrative"],
  mixed: ["Convergent", "Explanatory Sequential", "Exploratory Sequential", "Embedded"],
};

const ResearchContextSetup = ({ context, onChange, onComplete }: Props) => {
  const { project } = useProject();
  const [step, setStep] = useState(0);

  const update = (patch: Partial<ResearchContext>) => onChange({ ...context, ...patch });

  const availableDesigns = STUDY_DESIGNS[context.researchType] || [];

  const detectedVars = project.dataset.uploaded
    ? project.dataset.columns.map(c => ({
        name: c.name,
        type: c.type === "number" ? "Continuous" : c.type === "category" ? "Categorical" : "Ordinal",
        role: "undecided",
      }))
    : [];

  const [variables, setVariables] = useState(
    context.variables.length > 0 ? context.variables : detectedVars
  );

  const updateVarRole = (idx: number, role: string) => {
    const next = [...variables];
    next[idx] = { ...next[idx], role };
    setVariables(next);
    update({ variables: next });
  };

  const updateVarType = (idx: number, type: string) => {
    const next = [...variables];
    next[idx] = { ...next[idx], type };
    setVariables(next);
    update({ variables: next });
  };

  const steps = [
    {
      icon: FlaskConical,
      title: "Research Approach",
      subtitle: "What type of research are you conducting?",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Research Type</Label>
            <div className="grid grid-cols-3 gap-3">
              {["quantitative", "qualitative", "mixed"].map(t => (
                <button
                  key={t}
                  onClick={() => update({ researchType: t, studyDesign: "" })}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    context.researchType === t
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/40 text-muted-foreground"
                  }`}
                >
                  <p className="font-medium capitalize text-sm">{t}</p>
                </button>
              ))}
            </div>
          </div>
          {context.researchType && (
            <div className="animate-fade-in">
              <Label className="text-sm font-medium mb-2 block">Study Design</Label>
              <Select value={context.studyDesign} onValueChange={v => update({ studyDesign: v })}>
                <SelectTrigger><SelectValue placeholder="Select study design..." /></SelectTrigger>
                <SelectContent>
                  {availableDesigns.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="bg-accent/30 rounded-lg p-3 flex gap-2">
            <Info className="h-4 w-4 text-accent-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-accent-foreground">
              This context helps the AI suggest the most appropriate statistical tests for your data. 
              It will be reused throughout your project.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Target,
      title: "Research Questions",
      subtitle: "What are you investigating?",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Research Question(s)</Label>
            <Textarea
              placeholder="e.g., Is there a significant difference in crop disease detection accuracy between CropNet and baseline models?"
              value={context.researchQuestion}
              onChange={e => update({ researchQuestion: e.target.value })}
              rows={3}
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Hypotheses (optional)</Label>
            <Textarea
              placeholder="H₁: CropNet achieves significantly higher classification accuracy than baseline CNN models under field conditions."
              value={context.hypotheses}
              onChange={e => update({ hypotheses: e.target.value })}
              rows={3}
              className="text-sm"
            />
          </div>
        </div>
      ),
    },
    {
      icon: Variable,
      title: "Variables",
      subtitle: "Classify your variables for analysis",
      content: (
        <div className="space-y-3">
          {variables.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Variable className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Upload a dataset first to classify variables.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-2">
                Classify each variable to help the AI recommend appropriate tests.
              </p>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 gap-0 bg-muted/50 border-b border-border px-4 py-2">
                  <span className="text-xs font-semibold text-muted-foreground">Variable</span>
                  <span className="text-xs font-semibold text-muted-foreground">Type</span>
                  <span className="text-xs font-semibold text-muted-foreground">Role</span>
                </div>
                {variables.map((v, i) => (
                  <div key={v.name} className="grid grid-cols-3 gap-0 px-4 py-2.5 border-b border-border last:border-0 items-center">
                    <span className="text-sm font-medium">{v.name}</span>
                    <Select value={v.type} onValueChange={val => updateVarType(i, val)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Continuous">Continuous</SelectItem>
                        <SelectItem value="Categorical">Categorical</SelectItem>
                        <SelectItem value="Ordinal">Ordinal</SelectItem>
                        <SelectItem value="Nominal">Nominal</SelectItem>
                        <SelectItem value="Dichotomous">Dichotomous</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={v.role} onValueChange={val => updateVarRole(i, val)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="undecided">Undecided</SelectItem>
                        <SelectItem value="dependent">Dependent (DV)</SelectItem>
                        <SelectItem value="independent">Independent (IV)</SelectItem>
                        <SelectItem value="covariate">Covariate</SelectItem>
                        <SelectItem value="grouping">Grouping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  const canProceed = step === 0
    ? context.researchType && context.studyDesign
    : step === 1
    ? context.researchQuestion.trim().length > 10
    : true;

  return (
    <Card className="shadow-card overflow-hidden">
      {/* Step indicators */}
      <div className="flex border-b border-border">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <button
              key={i}
              onClick={() => i <= step && setStep(i)}
              className={`flex-1 flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                active ? "border-primary text-primary bg-primary/5" :
                done ? "border-success text-success" :
                "border-transparent text-muted-foreground"
              }`}
            >
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                done ? "bg-success text-success-foreground" :
                active ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          );
        })}
      </div>

      <div className="p-6">
        <div className="mb-1">
          <h3 className="font-display font-semibold text-lg">{steps[step].title}</h3>
          <p className="text-sm text-muted-foreground">{steps[step].subtitle}</p>
        </div>
        <div className="mt-4">{steps[step].content}</div>
        <div className="flex justify-between mt-6">
          <Button variant="outline" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button size="sm" onClick={() => setStep(step + 1)} disabled={!canProceed}>
              Continue <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button size="sm" onClick={() => { update({ variables }); onComplete(); }}>
              <Check className="h-4 w-4 mr-1" /> Save Context & Proceed
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ResearchContextSetup;
