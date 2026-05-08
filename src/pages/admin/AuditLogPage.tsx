import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeading from "@/components/dashboard/PageHeading";
import { useAudit } from "@/context/AuditContext";
import { ScrollText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const AuditLogPage = () => {
  const { entries } = useAudit();
  return (
    <div className="animate-fade-in">
      <PageHeading
        title="Audit Trail"
        subtitle="Immutable, append-only record of governance actions"
        badge={<Badge variant="outline" className="gap-1"><ScrollText className="h-3 w-3" /> Audit-ready</Badge>}
      />
      <Card className="p-0 shadow-soft overflow-hidden">
        <div className="divide-y divide-border">
          {entries.map((e) => (
            <div key={e.id} className="p-4 flex items-start gap-3 hover:bg-muted/30">
              <div className="h-8 w-8 rounded-full bg-primary/10 grid place-items-center text-primary text-xs font-semibold shrink-0">
                {e.actorName.split(" ").map(s => s[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{e.actorName}</p>
                  <Badge variant="secondary" className="text-[10px]">{e.actorRole}</Badge>
                  <code className="text-[10px] text-muted-foreground">{e.type}</code>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{e.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{formatDistanceToNow(new Date(e.timestamp), { addSuffix: true })}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AuditLogPage;
