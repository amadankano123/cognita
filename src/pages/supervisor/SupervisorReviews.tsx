import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Eye, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { mockSupervisedStudents } from "@/data/mockSupervisor";
import { cn } from "@/lib/utils";

type ReviewStatus = "pending" | "reviewed" | "revision-needed";

interface ReviewItem {
  id: string;
  studentName: string;
  studentId: string;
  section: string;
  submittedAt: string;
  status: ReviewStatus;
  degreeLevel: string;
}

const generateReviews = (): ReviewItem[] => {
  const sections = ["Abstract", "Literature Review", "Methodology", "Chapter 1", "Data Analysis", "Results"];
  const statuses: ReviewStatus[] = ["pending", "reviewed", "revision-needed"];
  return mockSupervisedStudents.flatMap((s, i) =>
    sections.slice(0, (i % 3) + 1).map((section, j) => ({
      id: `rev-${s.id}-${j}`,
      studentName: s.name,
      studentId: s.id,
      section,
      submittedAt: `${(j + 1) * 2} days ago`,
      status: statuses[(i + j) % 3],
      degreeLevel: s.degreeLevel,
    }))
  );
};

const reviews = generateReviews();

const statusBadge = (status: ReviewStatus) => {
  const config = {
    pending: { label: "Pending", icon: Clock, className: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20" },
    reviewed: { label: "Reviewed", icon: CheckCircle, className: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20" },
    "revision-needed": { label: "Needs Revision", icon: AlertTriangle, className: "bg-destructive/10 text-destructive border-destructive/20" },
  };
  const { label, icon: Icon, className } = config[status];
  return (
    <Badge variant="outline" className={cn("gap-1 text-xs", className)}>
      <Icon className="h-3 w-3" /> {label}
    </Badge>
  );
};

const SupervisorReviews = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("pending");

  const pending = reviews.filter(r => r.status === "pending");
  const reviewed = reviews.filter(r => r.status === "reviewed");
  const revisionNeeded = reviews.filter(r => r.status === "revision-needed");

  const getList = () => {
    if (tab === "pending") return pending;
    if (tab === "reviewed") return reviewed;
    if (tab === "revision") return revisionNeeded;
    return reviews;
  };

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader title="Reviews" subtitle="Review student section submissions and provide feedback" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 text-center shadow-card">
          <Clock className="h-5 w-5 text-[hsl(var(--warning))] mx-auto mb-1" />
          <p className="text-2xl font-bold">{pending.length}</p>
          <p className="text-xs text-muted-foreground">Pending Review</p>
        </Card>
        <Card className="p-4 text-center shadow-card">
          <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mx-auto mb-1" />
          <p className="text-2xl font-bold">{reviewed.length}</p>
          <p className="text-xs text-muted-foreground">Reviewed</p>
        </Card>
        <Card className="p-4 text-center shadow-card">
          <AlertTriangle className="h-5 w-5 text-destructive mx-auto mb-1" />
          <p className="text-2xl font-bold">{revisionNeeded.length}</p>
          <p className="text-xs text-muted-foreground">Needs Revision</p>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed ({reviewed.length})</TabsTrigger>
          <TabsTrigger value="revision">Needs Revision ({revisionNeeded.length})</TabsTrigger>
          <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
        </TabsList>

        {["pending", "reviewed", "revision", "all"].map(t => (
          <TabsContent key={t} value={t}>
            <Card className="shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Degree</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getList().map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.studentName}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{r.degreeLevel}</Badge></TableCell>
                      <TableCell className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-muted-foreground" />{r.section}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{r.submittedAt}</TableCell>
                      <TableCell>{statusBadge(r.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/supervisor/students/${r.studentId}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getList().length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No reviews in this category.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SupervisorReviews;
