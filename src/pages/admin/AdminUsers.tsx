import { useInstitution } from "@/context/InstitutionContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/layout/PageHeader";

const AdminUsers = () => {
  const { institution } = useInstitution();
  const allUsers = institution.users;
  const students = allUsers.filter(u => u.role === "Student");
  const supervisors = allUsers.filter(u => u.role === "Supervisor");
  const hods = allUsers.filter(u => u.role === "Head of Department");

  const UserRow = ({ u }: { u: typeof allUsers[0] }) => (
    <div className="p-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{u.name}</p>
        <p className="text-xs text-muted-foreground">{u.email} · {u.department || u.institution}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">{u.role}</Badge>
        {u.studentCategory && <Badge variant="secondary" className="text-xs">{u.studentCategory}</Badge>}
        {u.academicTitle && <Badge variant="secondary" className="text-xs">{u.academicTitle}</Badge>}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader title="All Users" subtitle="View all registered users by role" />
      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="supervisors">Supervisors ({supervisors.length})</TabsTrigger>
          <TabsTrigger value="hods">HODs ({hods.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <Card className="shadow-card">
            <div className="divide-y divide-border">
              {students.map(u => <UserRow key={u.id} u={u} />)}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="supervisors">
          <Card className="shadow-card">
            <div className="divide-y divide-border">
              {supervisors.map(u => <UserRow key={u.id} u={u} />)}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="hods">
          <Card className="shadow-card">
            <div className="divide-y divide-border">
              {hods.length === 0 ? <p className="p-6 text-center text-sm text-muted-foreground">No HODs registered.</p> : hods.map(u => <UserRow key={u.id} u={u} />)}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsers;
