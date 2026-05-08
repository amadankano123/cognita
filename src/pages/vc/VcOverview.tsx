import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Building2, ShieldCheck, TrendingUp, Users } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import PageHeading from "@/components/dashboard/PageHeading";
import { useInstitution } from "@/context/InstitutionContext";
import { useInstitutionConfig } from "@/context/InstitutionConfigContext";

const VcOverview = () => {
  const { institution } = useInstitution();
  const { config } = useInstitutionConfig();
  const avgIntegrity = Math.round(institution.projects.reduce((a, p) => a + p.integrityScore, 0) / Math.max(1, institution.projects.length));
  return (
    <div className="animate-fade-in">
      <PageHeading
        title="Vice Chancellor Executive View"
        subtitle={`${institution.name} — institution-wide research posture`}
        badge={<Badge variant="outline" className="text-primary border-primary/30 gap-1"><Crown className="h-3 w-3" /> VC</Badge>}
      />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Faculties" value={config.faculties.length} icon={Building2} />
        <StatCard label="Researchers" value={institution.totalResearchers} icon={Users} />
        <StatCard label="Active Projects" value={institution.activeProjects} icon={TrendingUp} />
        <StatCard label="Publications YTD" value={institution.publicationsThisYear} icon={TrendingUp} tone="success" />
        <StatCard label="Avg. Integrity" value={`${avgIntegrity}%`} icon={ShieldCheck} tone={avgIntegrity >= 80 ? "success" : "warning"} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5 shadow-soft">
          <h3 className="font-display font-semibold mb-4">Faculty Performance</h3>
          <div className="space-y-3">
            {config.faculties.map((f) => {
              const deptNames = new Set(f.departments.map((d) => d.name));
              const projects = institution.projects.filter((p) => deptNames.has(p.department));
              const avg = Math.round(projects.reduce((a, p) => a + p.integrityScore, 0) / Math.max(1, projects.length));
              return (
                <div key={f.id} className="p-3 border border-border/60 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-sm">{f.name}</p>
                    <Badge variant="secondary">{projects.length} projects</Badge>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${avg || 0}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Avg. integrity: {avg || 0}%</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 shadow-soft">
          <h3 className="font-display font-semibold mb-4">Institutional Health</h3>
          <div className="space-y-3 text-sm">
            <Row label="Min integrity policy" value={`${config.policies.minIntegrityScore}%`} />
            <Row label="Ethics review required" value={config.policies.requireEthicsReview ? "Yes" : "No"} />
            <Row label="AI Rewrite" value={config.policies.allowAiRewrite ? "Allowed" : "Restricted"} />
            <Row label="AI Generation" value={config.policies.allowAiGeneration ? "Allowed" : "Restricted"} />
            <Row label="AI Reviews this month" value={institution.aiReviewsThisMonth} />
          </div>
        </Card>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between border-b border-border/40 pb-2">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default VcOverview;
