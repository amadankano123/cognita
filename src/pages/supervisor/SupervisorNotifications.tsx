import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, AlertTriangle, XCircle, CheckCircle, Flag, Bell } from "lucide-react";
import { mockSupervisedStudents, type StudentNotification } from "@/data/mockSupervisor";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const SupervisorNotifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");

  // Aggregate all notifications
  const allNotifications = mockSupervisedStudents.flatMap(student =>
    student.notifications.map(n => ({ ...n, studentId: student.id, studentName: student.name }))
  ).sort((a, b) => (a.read ? 1 : -1));

  const filtered = filter === "all" ? allNotifications : allNotifications.filter(n => n.type === filter);

  const iconMap: Record<string, React.ReactNode> = {
    overdue: <Clock className="h-4 w-4 text-[hsl(var(--warning))]" />,
    "missing-data": <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />,
    "plagiarism-risk": <XCircle className="h-4 w-4 text-destructive" />,
    "analysis-issue": <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />,
    deadline: <Clock className="h-4 w-4 text-primary" />,
    milestone: <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />,
  };

  const typeLabel: Record<string, string> = {
    overdue: "Overdue",
    "missing-data": "Missing Data",
    "plagiarism-risk": "Plagiarism Risk",
    "analysis-issue": "Analysis Issue",
    deadline: "Deadline",
    milestone: "Milestone",
  };

  const unreadCount = allNotifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl animate-fade-in">
      <PageHeader title="Notifications & Alerts" subtitle={`${unreadCount} unread alert${unreadCount !== 1 ? "s" : ""} across your supervised students`} />

      <div className="flex items-center gap-3 mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Alerts</SelectItem>
            <SelectItem value="plagiarism-risk">Plagiarism Risk</SelectItem>
            <SelectItem value="analysis-issue">Analysis Issues</SelectItem>
            <SelectItem value="milestone">Submissions & Approvals</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="missing-data">Missing Data</SelectItem>
            <SelectItem value="deadline">Deadlines</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} alert{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground shadow-card">
            <Bell className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
            <p>No notifications match the selected filter.</p>
          </Card>
        ) : (
          filtered.map(n => (
            <Card key={`${n.studentId}-${n.id}`} className={cn("p-4 shadow-card flex items-start gap-3 cursor-pointer hover:bg-muted/30 transition-colors", !n.read && "border-l-4 border-l-primary")} onClick={() => navigate(`/supervisor/students/${n.studentId}`)}>
              {iconMap[n.type]}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.studentName}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.timestamp}</p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">{typeLabel[n.type] ?? n.type}</Badge>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SupervisorNotifications;
