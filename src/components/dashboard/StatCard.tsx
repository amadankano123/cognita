import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: string;
  tone?: "default" | "success" | "warning" | "critical";
  className?: string;
}

const toneStyles: Record<NonNullable<Props["tone"]>, string> = {
  default: "from-primary/10 to-primary/5 text-primary",
  success: "from-emerald-500/15 to-emerald-500/5 text-emerald-700",
  warning: "from-amber-500/15 to-amber-500/5 text-amber-700",
  critical: "from-rose-500/15 to-rose-500/5 text-rose-700",
};

const StatCard = ({ label, value, icon: Icon, delta, tone = "default", className }: Props) => (
  <Card className={cn("p-4 shadow-soft border-border/60 hover:shadow-glow transition-shadow", className)}>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-semibold text-foreground mt-1 truncate">{value}</p>
        {delta && <p className="text-xs text-muted-foreground mt-1">{delta}</p>}
      </div>
      <div className={cn("h-10 w-10 rounded-lg bg-gradient-to-br grid place-items-center ring-1 ring-border/60 shrink-0", toneStyles[tone])}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </Card>
);

export default StatCard;
