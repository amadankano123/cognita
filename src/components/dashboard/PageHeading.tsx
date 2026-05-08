import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

const PageHeading = ({ title, subtitle, badge, actions }: Props) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        {badge}
      </div>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeading;
