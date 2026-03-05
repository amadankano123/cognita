import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserCheck, Users, ArrowRightLeft, Shield } from "lucide-react";
import { mockDepartmentSupervisors, mockDepartmentStudents } from "@/data/mockHod";

const HodSupervisors = () => {
  const [supervisors] = useState(mockDepartmentSupervisors);
  const students = mockDepartmentStudents;
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");

  const unassignedStudents = students.filter(
    s => !supervisors.some(sup => sup.students.includes(s.id))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Supervisors</h1>
          <p className="text-muted-foreground text-sm">Manage supervisor workloads and student assignments</p>
        </div>
        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <ArrowRightLeft className="h-4 w-4 mr-2" /> Assign Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Student to Supervisor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium text-foreground">Student</label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger><SelectValue placeholder="Select a student" /></SelectTrigger>
                  <SelectContent>
                    {students.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name} — {s.degreeLevel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Supervisor</label>
                <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
                  <SelectTrigger><SelectValue placeholder="Select a supervisor" /></SelectTrigger>
                  <SelectContent>
                    {supervisors.filter(s => s.studentCount < s.maxCapacity).map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name} ({s.studentCount}/{s.maxCapacity})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" disabled={!selectedStudent || !selectedSupervisor} onClick={() => setAssignOpen(false)}>
                Confirm Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Supervisor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {supervisors.map(sup => {
          const supStudents = students.filter(s => sup.students.includes(s.id));
          return (
            <Card key={sup.id} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{sup.name}</h3>
                  <p className="text-xs text-muted-foreground">{sup.title} · {sup.specialization}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {sup.studentCount}/{sup.maxCapacity} students
                </Badge>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-muted-foreground">Capacity</span>
                <Progress value={(sup.studentCount / sup.maxCapacity) * 100} className="flex-1 h-2" />
              </div>

              {supStudents.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Assigned Students</p>
                  {supStudents.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-2 rounded border border-border">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.projectTitle}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={s.complianceStatus === "Critical" ? "destructive" : s.complianceStatus === "Warning" ? "secondary" : "outline"} className="text-[10px]">
                          {s.complianceStatus}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{s.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No students assigned</p>
              )}

              {sup.avgIntegrityScore > 0 && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Avg integrity: {sup.avgIntegrityScore}%</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HodSupervisors;
