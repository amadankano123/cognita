import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/layout/PageHeader";

const HodSettings = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl animate-fade-in">
      <PageHeader title="Department Settings" subtitle="Configure department-specific preferences" />
      <Card className="shadow-card p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Department</p>
            <p className="text-sm text-muted-foreground">{user?.department || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Faculty</p>
            <p className="text-sm text-muted-foreground">{user?.faculty || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Head of Department</p>
            <p className="text-sm text-muted-foreground">{user?.name || "—"}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-6">Department template customization coming soon.</p>
        </div>
      </Card>
    </div>
  );
};

export default HodSettings;
