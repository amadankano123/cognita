import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/layout/PageHeader";
import { User } from "lucide-react";

const SupervisorProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl animate-fade-in">
      <PageHeader title="Profile" subtitle="Your supervisor profile" />
      <Card className="shadow-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Role</span><Badge>{user?.role}</Badge></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Academic Title</span><span>{user?.academicTitle || "—"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Faculty</span><span>{user?.faculty || "—"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span>{user?.department || "—"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Institution</span><span>{user?.institution}</span></div>
        </div>
      </Card>
    </div>
  );
};

export default SupervisorProfile;
