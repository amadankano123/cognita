import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserCheck, ArrowRightLeft, Shield } from "lucide-react";
import { mockDepartmentSupervisors, mockDepartmentStudents } from "@/data/mockHod";
import { toast } from "sonner";

const degreeColor: Record<string, string> = {
  Undergraduate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Master's": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  PhD: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

const HodSupervisors = () => {
  const [supervisors] = useState(mockDepartmentSupervisors);
  const students = mockDepartmentStudents;
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [assignTab, setAssignTab] = useState("undergraduate");

  const handleAssign = () => {
    if (selectedStudent && selectedSupervisor) {
      const student = students.find(s => s.id === selectedStudent);
      const supervisor = supervisors.find(s => s.id === selectedSupervisor);
      toast.success(`Assigned ${student?.name} to ${supervisor?.name}`);
      setAssignOpen(false);
      setSelectedStudent("");
      setSelectedSupervisor("");
    }
  };

  const renderSupervisorCards = (filterType: "undergraduate" | "postgraduate") => {
    const isUG = filterType === "undergraduate";
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {supervisors.map(sup => {
          const supStudents = students.filter(s => sup.students.includes(s.id));
          const filteredStudents = supStudents.filter(s =>
            isUG ? s.degreeLevel === "Undergraduate" : ["Master's", "PhD"].includes(s.degreeLevel)
          );

          return (
            <Card key={sup.id} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{sup.name}</h3>
                  <p className="text-xs text-muted-foreground">{sup.title} · {sup.specialization}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="text-xs">
                    {supStudents.length}/{sup.maxCapacity} total
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {filteredStudents.length} {isUG ? "UG" : "PG"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-muted-foreground">Capacity</span>
                <Progress value={(supStudents.length / sup.maxCapacity) * 100} className="flex-1 h-2" />
              </div>

              {filteredStudents.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {isUG ? "Undergraduate" : "Postgraduate"} Students
                  </p>
                  {filteredStudents.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-2 rounded border border-border">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.projectTitle}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={`text-[10px] ${degreeColor[s.degreeLevel]}`}>{s.degreeLevel}</Badge>
                        <Badge variant={s.complianceStatus === "Critical" ? "destructive" : s.complianceStatus === "Warning" ? "secondary" : "outline"} className="text-[10px]">
                          {s.complianceStatus}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{s.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No {isUG ? "undergraduate" : "postgraduate"} students assigned</p>
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
    );
  };

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
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} — {s.degreeLevel}
                      </SelectItem>
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
              <Button className="w-full" disabled={!selectedStudent || !selectedSupervisor} onClick={handleAssign}>
                Confirm Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={assignTab} onValueChange={setAssignTab} className="w-full">
        <TabsList>
          <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
          <TabsTrigger value="postgraduate">Postgraduate</TabsTrigger>
        </TabsList>
        <TabsContent value="undergraduate">
          {renderSupervisorCards("undergraduate")}
        </TabsContent>
        <TabsContent value="postgraduate">
          {renderSupervisorCards("postgraduate")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HodSupervisors;
