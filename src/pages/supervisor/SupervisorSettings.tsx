import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, User, Bell, Shield } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";

const SupervisorSettings = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "Prof. Kwame Mwangi",
    email: user?.email || "k.mwangi@university.ac",
    department: "Computer Science",
    title: "Professor",
    phone: "+234 80 123 4567",
    specialization: "Machine Learning & Data Privacy",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    submissionAlerts: true,
    complianceAlerts: true,
    weeklyDigest: false,
    messageAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    similarityThreshold: "25",
    aiDetectionThreshold: "15",
    autoReminders: true,
    reminderFrequency: "weekly",
  });

  const handleSave = () => toast.success("Settings saved successfully.");

  return (
    <div className="max-w-3xl animate-fade-in">
      <PageHeader title="Settings" subtitle="Manage your profile, notifications, and supervision preferences" />

      {/* Profile */}
      <Card className="shadow-card mb-6">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold">Profile</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} /></div>
            <div><Label>Email</Label><Input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} /></div>
            <div><Label>Department</Label><Input value={profile.department} onChange={e => setProfile(p => ({ ...p, department: e.target.value }))} /></div>
            <div><Label>Title</Label><Input value={profile.title} onChange={e => setProfile(p => ({ ...p, title: e.target.value }))} /></div>
            <div><Label>Specialization</Label><Input value={profile.specialization} onChange={e => setProfile(p => ({ ...p, specialization: e.target.value }))} /></div>
            <div><Label>Phone</Label><Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} /></div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="shadow-card mb-6">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold">Notifications</h3>
        </div>
        <div className="p-4 space-y-4">
          {([
            ["emailAlerts", "Email Alerts", "Receive email notifications for important events"],
            ["submissionAlerts", "Submission Alerts", "Get notified when students submit sections for review"],
            ["complianceAlerts", "Compliance Alerts", "Alerts for plagiarism and AI detection issues"],
            ["weeklyDigest", "Weekly Digest", "Receive a weekly summary of student progress"],
            ["messageAlerts", "Message Alerts", "Notifications for new student messages"],
          ] as const).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
              <Switch checked={notifications[key]} onCheckedChange={v => setNotifications(n => ({ ...n, [key]: v }))} />
            </div>
          ))}
        </div>
      </Card>

      {/* Supervision Preferences */}
      <Card className="shadow-card mb-6">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold">Supervision Preferences</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Similarity Threshold (%)</Label>
              <Input type="number" value={preferences.similarityThreshold} onChange={e => setPreferences(p => ({ ...p, similarityThreshold: e.target.value }))} />
              <p className="text-xs text-muted-foreground mt-1">Flag students above this threshold</p>
            </div>
            <div>
              <Label>AI Detection Threshold (%)</Label>
              <Input type="number" value={preferences.aiDetectionThreshold} onChange={e => setPreferences(p => ({ ...p, aiDetectionThreshold: e.target.value }))} />
              <p className="text-xs text-muted-foreground mt-1">Flag students above this threshold</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Auto Reminders</p><p className="text-xs text-muted-foreground">Automatically remind students about deadlines</p></div>
            <Switch checked={preferences.autoReminders} onCheckedChange={v => setPreferences(p => ({ ...p, autoReminders: v }))} />
          </div>
          <div>
            <Label>Reminder Frequency</Label>
            <Select value={preferences.reminderFrequency} onValueChange={v => setPreferences(p => ({ ...p, reminderFrequency: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full sm:w-auto">
        <Save className="h-4 w-4 mr-2" /> Save Settings
      </Button>
    </div>
  );
};

export default SupervisorSettings;
