import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Shield, FileText } from "lucide-react";
import { mockDepartmentStudents, mockDepartmentSupervisors } from "@/data/mockHod";

const degreeColor: Record<string, string> = {
  Undergraduate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Master's": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  PhD: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

const HodStudents = () => {
  const students = mockDepartmentStudents;
  const supervisors = mockDepartmentSupervisors;

  const getSupervisor = (studentId: string) =>
    supervisors.find(s => s.students.includes(studentId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Department Students</h1>
        <p className="text-muted-foreground text-sm">All students in your department and their project progress</p>
      </div>

      <div className="space-y-3">
        {students.map(student => {
          const supervisor = getSupervisor(student.id);
          return (
            <Card key={student.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{student.name}</h3>
                    <Badge className={`text-[10px] ${degreeColor[student.degreeLevel]}`}>{student.degreeLevel}</Badge>
                    <Badge variant={student.complianceStatus === "Critical" ? "destructive" : student.complianceStatus === "Warning" ? "secondary" : "outline"} className="text-[10px]">
                      {student.complianceStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{student.projectTitle}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      {supervisor ? supervisor.name : "Unassigned"}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Stage: {student.stage}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Integrity: {student.integrityScore}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-lg font-bold text-foreground">{student.progress}%</span>
                  <Progress value={student.progress} className="w-24 h-2" />
                  <span className="text-[10px] text-muted-foreground">{student.wordCount.toLocaleString()}/{student.targetWordCount.toLocaleString()} words</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HodStudents;
