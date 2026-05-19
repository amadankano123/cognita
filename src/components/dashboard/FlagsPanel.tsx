import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info, Flag, Clock, UserX, CalendarX } from "lucide-react";
import {
  AccountabilityFlag,
  FlagCategory,
  flagCategoryLabel,
} from "@/data/mockFlags";
import { cn } from "@/lib/utils";

const severityStyles: Record<AccountabilityFlag["severity"], string> = {
  critical: "border-destructive/40 bg-destructive/5",
  warning: "border-[hsl(var(--warning))]/40 bg-[hsl(var(--warning))]/5",
  info: "border-primary/30 bg-primary/5",
};

const severityBadge: Record<AccountabilityFlag["severity"], string> = {
  critical: "bg-destructive text-destructive-foreground",
  warning: "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground,0_0%_100%))]",
  info: "bg-primary/10 text-primary",
};

const statusBadge: Record<AccountabilityFlag["status"], string> = {
  open: "bg-muted text-foreground",
  reminded: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  escalated: "bg-destructive/15 text-destructive",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

const categoryIcon: Record<FlagCategory, typeof Flag> = {
  inactivity: UserX,
  "supervisor-responsiveness": Clock,
  deadline: CalendarX,
};

const severityIcon = (s: AccountabilityFlag["severity"]) =>
  s === "critical" ? AlertCircle : s === "warning" ? AlertTriangle : Info;

interface FlagsPanelProps {
  flags: AccountabilityFlag[];
  title?: string;
  subtitle?: string;
  showSubject?: boolean; // show student/supervisor names (HOD/Admin views)
  compact?: boolean;
  emptyMessage?: string;
}

const FlagsPanel = ({
  flags,
  title = "Accountability Flags",
  subtitle,
  showSubject = false,
  compact = false,
  emptyMessage = "No active flags. Everything is on track.",
}: FlagsPanelProps) => {
  const counts = {
    critical: flags.filter(f => f.severity === "critical").length,
    warning: flags.filter(f => f.severity === "warning").length,
    info: flags.filter(f => f.severity === "info").length,
  };

  return (
    <Card className="shadow-card">
      <div className="p-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-primary" />
          <div>
            <h3 className="font-display font-semibold text-sm">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[10px]">{counts.critical} Critical</Badge>
          <Badge variant="outline" className="text-[10px]">{counts.warning} Warning</Badge>
          <Badge variant="outline" className="text-[10px]">{counts.info} Info</Badge>
        </div>
      </div>

      <div className={cn("divide-y divide-border", compact && "max-h-80 overflow-y-auto")}>
        {flags.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">{emptyMessage}</p>
        ) : (
          flags.map(flag => {
            const CatIcon = categoryIcon[flag.category];
            const SevIcon = severityIcon(flag.severity);
            return (
              <div key={flag.id} className={cn("p-4 border-l-4", severityStyles[flag.severity])}>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-card flex items-center justify-center shrink-0 shadow-card">
                    <CatIcon className="h-4 w-4 text-foreground/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge className={cn("text-[10px] capitalize", severityBadge[flag.severity])}>
                        <SevIcon className="h-2.5 w-2.5 mr-1" />
                        {flag.severity}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">{flagCategoryLabel[flag.category]}</Badge>
                      <Badge className={cn("text-[10px] capitalize", statusBadge[flag.status])}>{flag.status}</Badge>
                      {flag.milestone && <Badge variant="outline" className="text-[10px]">{flag.milestone}</Badge>}
                    </div>
                    <p className="text-sm font-medium text-foreground">{flag.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{flag.detail}</p>
                    <div className="flex items-center gap-3 flex-wrap mt-2 text-[11px] text-muted-foreground">
                      <span><span className="font-medium">Rule:</span> {flag.rule}</span>
                      {flag.daysOverdue > 0 && (
                        <span className="text-destructive font-medium">{flag.daysOverdue}d overdue</span>
                      )}
                      <span>{flag.remindersSent} reminder{flag.remindersSent === 1 ? "" : "s"} sent</span>
                      {flag.escalatedTo && <span>Escalated → {flag.escalatedTo}</span>}
                      {showSubject && flag.studentName && (
                        <span><span className="font-medium">Student:</span> {flag.studentName}</span>
                      )}
                      {showSubject && flag.supervisorName && flag.category === "supervisor-responsiveness" && (
                        <span><span className="font-medium">Supervisor:</span> {flag.supervisorName}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default FlagsPanel;
