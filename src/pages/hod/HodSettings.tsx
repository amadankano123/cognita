import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Building2, User, Shield, Save } from "lucide-react";
import { mockHodDepartment } from "@/data/mockHod";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

const HodSettings = () => {
  const { user } = useAuth();
  const dept = mockHodDepartment;

  const [profile, setProfile] = useState({
    name: user?.name || "Prof. Adaeze Okonkwo",
    email: user?.email || "a.okonkwo@university.ac",
    title: "Professor & Head of Department",
    phone: "+234 80 987 6543",
  });

  const [deptSettings, setDeptSettings] = useState({
    maxStudentsPerSupervisor: "8",
    similarityThreshold: "25",
    aiDetectionThreshold: "30",
    requireEthicsApproval: true,
    autoAssignSupervisors: false,
  });

  const handleSave = () => toast.success("Settings saved successfully.");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Department Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your profile and department configuration</p>
      </div>

      {/* Profile */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">HOD Profile</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Full Name</Label><Input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} /></div>
          <div><Label>Email</Label><Input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} /></div>
          <div><Label>Title</Label><Input value={profile.title} onChange={e => setProfile(p => ({ ...p, title: e.target.value }))} /></div>
          <div><Label>Phone</Label><Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} /></div>
        </div>
      </Card>

      {/* Department Info */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Department Information</h2>
        </div>
        <div><Label>Department Name</Label><Input defaultValue={dept.departmentName} /></div>
        <div><Label>Faculty</Label><Input defaultValue={dept.faculty} /></div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-primary">{dept.totalStudents}</p>
            <p className="text-xs text-muted-foreground">Students</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-primary">{dept.totalSupervisors}</p>
            <p className="text-xs text-muted-foreground">Supervisors</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-primary">{dept.avgIntegrity}%</p>
            <p className="text-xs text-muted-foreground">Avg Integrity</p>
          </div>
        </div>
      </Card>

      {/* Compliance Policies */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Compliance Policies</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Max Students per Supervisor</Label>
            <Input type="number" value={deptSettings.maxStudentsPerSupervisor} onChange={e => setDeptSettings(s => ({ ...s, maxStudentsPerSupervisor: e.target.value }))} />
          </div>
          <div>
            <Label>Similarity Threshold (%)</Label>
            <Input type="number" value={deptSettings.similarityThreshold} onChange={e => setDeptSettings(s => ({ ...s, similarityThreshold: e.target.value }))} />
            <p className="text-xs text-muted-foreground mt-1">Students above this are flagged</p>
          </div>
          <div>
            <Label>AI Detection Threshold (%)</Label>
            <Input type="number" value={deptSettings.aiDetectionThreshold} onChange={e => setDeptSettings(s => ({ ...s, aiDetectionThreshold: e.target.value }))} />
            <p className="text-xs text-muted-foreground mt-1">Students above this are flagged</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Require Ethics Approval</p><p className="text-xs text-muted-foreground">Students must upload ethics clearance before data collection</p></div>
            <Switch checked={deptSettings.requireEthicsApproval} onCheckedChange={v => setDeptSettings(s => ({ ...s, requireEthicsApproval: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Auto-Assign Supervisors</p><p className="text-xs text-muted-foreground">Automatically assign supervisors based on capacity</p></div>
            <Switch checked={deptSettings.autoAssignSupervisors} onCheckedChange={v => setDeptSettings(s => ({ ...s, autoAssignSupervisors: v }))} />
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full sm:w-auto">
        <Save className="h-4 w-4 mr-2" /> Save Settings
      </Button>
    </div>
  );
};

export default HodSettings;
