import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

const PageHeader = ({ title, subtitle, breadcrumb }: PageHeaderProps) => (
  <div className="mb-6 animate-fade-in">
    {breadcrumb && (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
        <span>Project</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate max-w-md">{breadcrumb}</span>
      </div>
    )}
    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
    {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
  </div>
);

export default PageHeader;
