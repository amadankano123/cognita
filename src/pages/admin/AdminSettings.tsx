import { useState } from "react";
import { useInstitution } from "@/context/InstitutionContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw } from "lucide-react";

const AdminSettings = () => {
  const { institution } = useInstitution();
  const { user } = useAuth();
  const { toast } = useToast();
  const [allowGeneration, setAllowGeneration] = useState(false);
  const [allowRewrite, setAllowRewrite] = useState(true);
  const [requireEthics, setRequireEthics] = useState(true);
  const [integrityThreshold, setIntegrityThreshold] = useState("70");

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Institutional policies and configuration</p>
      </div>

      <Card className="p-5 shadow-card mb-4">
        <h3 className="font-display font-semibold mb-3">Administrator Profile</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{user?.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{user?.email}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Institution</span><span className="font-medium">{institution.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Role</span><span className="font-medium">{user?.role}</span></div>
        </div>
      </Card>

      <Card className="p-5 shadow-card mb-4">
        <h3 className="font-display font-semibold mb-3">Institution Details</h3>
        <div className="space-y-3">
          <div><Label className="text-xs text-muted-foreground">Institution Name</Label><Input defaultValue={institution.name} className="mt-1" /></div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-primary">{institution.totalResearchers}</p>
              <p className="text-xs text-muted-foreground">Researchers</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-primary">{institution.activeProjects}</p>
              <p className="text-xs text-muted-foreground">Active Projects</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-primary">{institution.publicationsThisYear}</p>
              <p className="text-xs text-muted-foreground">Publications</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5 shadow-card mb-4">
        <h3 className="font-display font-semibold mb-4">AI Policy (Institution-wide)</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><Label className="text-sm font-medium">Allow AI Rewrite Suggestions</Label><p className="text-xs text-muted-foreground">Researchers can use AI to rewrite sentences</p></div>
            <Switch checked={allowRewrite} onCheckedChange={setAllowRewrite} />
          </div>
          <div className="flex items-center justify-between">
            <div><Label className="text-sm font-medium">Allow Full AI Generation</Label><p className="text-xs text-muted-foreground">Researchers can generate entire sections with AI</p></div>
            <Switch checked={allowGeneration} onCheckedChange={setAllowGeneration} />
          </div>
          <div className="flex items-center justify-between">
            <div><Label className="text-sm font-medium">Require Ethics Review</Label><p className="text-xs text-muted-foreground">Projects must have ethics clearance before export</p></div>
            <Switch checked={requireEthics} onCheckedChange={setRequireEthics} />
          </div>
          <div>
            <Label className="text-sm font-medium">Minimum Integrity Score for Submission</Label>
            <Input type="number" value={integrityThreshold} onChange={e => setIntegrityThreshold(e.target.value)} className="w-24 mt-1" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;
