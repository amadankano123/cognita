import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { project, resetProject } = useProject();
  const { user } = useAuth();
  const { toast } = useToast();
  const [demoMode, setDemoMode] = useState(true);

  const handleReset = () => {
    resetProject();
    toast({ title: "Demo data reset", description: "All project data has been restored to defaults." });
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <PageHeader
        title="Settings"
        subtitle="Manage your account and project preferences"
        breadcrumb={project.title}
      />

      {/* Profile */}
      <Card className="p-5 shadow-card mb-4">
        <h3 className="font-display font-semibold mb-3">Profile</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Institution</span>
            <span className="font-medium">{user?.institution}</span>
          </div>
        </div>
      </Card>

      {/* Demo Mode */}
      <Card className="p-5 shadow-card mb-4">
        <h3 className="font-display font-semibold mb-3">Demo Mode</h3>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="demo-toggle" className="text-sm font-medium">Enable Demo Mode</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pre-loads sample project data for testing
            </p>
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
