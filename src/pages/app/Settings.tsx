import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { project, resetProject } = useProject();
  const { user } = useAuth();
  const { toast } = useToast();
  const [demoMode, setDemoMode] = useState(true);
  const [citationDefault, setCitationDefault] = useState("apa");
  const [aiReviewer, setAiReviewer] = useState(true);
  const [aiRewrite, setAiRewrite] = useState(true);
  const [aiGenerate, setAiGenerate] = useState(false);

  const handleReset = () => {
    resetProject();
    toast({ title: "Demo data reset", description: "All project data has been restored to defaults." });
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <PageHeader
        title="Settings"
        subtitle="Manage your project and account preferences"
        breadcrumb={project.title}
      />

      {/* Profile */}
      <Card className="p-5 shadow-card mb-4">
        <h3 className="font-display font-semibold mb-3">Profile</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{user?.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{user?.email}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Institution</span><span className="font-medium">{user?.institution}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Role</span><span className="font-medium">{user?.role}</span></div>
        </div>
      </Card>

      {/* Project Metadata */}
      <Card className="p-5 shadow-card mb-4">
        <h3 className="font-display font-semibold mb-3">Project Metadata</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input defaultValue={project.title} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Discipline</Label>
            <Input defaultValue={project.discipline} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Output Type</Label>
              <Input defaultValue={project.targetOutput} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Target Journal</Label>
              <Input defaultValue={project.targetJournal} className="mt-1" />
            </div>
          </div>
        </div>
      </Card>

      {/* Citation Default */}
      <Card className="p-5 shadow-card mb-4">
        <h3 className="font-display font-semibold mb-3">Citation Style Default</h3>
        <Select value={citationDefault} onValueChange={setCitationDefault}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="apa">APA 7th Edition</SelectItem>
            <SelectItem value="ieee">IEEE</SelectItem>
            <SelectItem value="chicago">Chicago</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* AI Policies */}
      <Card className="p-5 shadow-card mb-4">
        <h3 className="font-display font-semibold mb-4">AI Policy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Reviewer Only</Label>
              <p className="text-xs text-muted-foreground">AI can review and score your writing</p>
            </div>
            <Switch checked={aiReviewer} onCheckedChange={setAiReviewer} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Allow Rewrite Suggestions</Label>
              <p className="text-xs text-muted-foreground">AI can suggest sentence-level rewrites</p>
            </div>
            <Switch checked={aiRewrite} onCheckedChange={setAiRewrite} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Allow Full Section Generation</Label>
              <p className="text-xs text-muted-foreground">AI can generate entire sections (use with caution)</p>
            </div>
            <Switch checked={aiGenerate} onCheckedChange={setAiGenerate} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-md">
          🔒 Privacy: Your data is processed securely and never used to train models. AI features comply with institutional research integrity policies.
        </p>
      </Card>

      {/* Demo Mode */}
      <Card className="p-5 shadow-card mb-4">
        <h3 className="font-display font-semibold mb-3">Demo Mode</h3>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="demo-toggle" className="text-sm font-medium">Enable Demo Mode</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Pre-loads sample project data for testing</p>
          </div>
          <Switch id="demo-toggle" checked={demoMode} onCheckedChange={setDemoMode} />
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Reset Demo Data
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
