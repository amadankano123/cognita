import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cognitaLogo from "@/assets/cognita-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useInstitution } from "@/context/InstitutionContext";
import { AppRole, ALL_ROLES, STUDENT_CATEGORIES, ACADEMIC_TITLES, PROJECT_TYPES, StudentCategory, AcademicTitle, ProjectType } from "@/types/research";

const COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Egypt", "Tanzania", "Uganda",
  "Ethiopia", "Rwanda", "Cameroon", "Senegal", "United Kingdom", "United States",
  "Canada", "Australia", "India", "Germany", "France", "Brazil", "Japan",
];

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("demo@greenfield.edu");
  const [password, setPassword] = useState("password");
  const [name, setName] = useState("");
  const [role, setRole] = useState<AppRole>("Student");
  // Student fields
  const [studentCategory, setStudentCategory] = useState<StudentCategory>("Undergraduate");
  const [matricId, setMatricId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [programme, setProgramme] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("Thesis");
  // Supervisor fields
  const [academicTitle, setAcademicTitle] = useState<AcademicTitle>("Lecturer II");
  // Research Director fields
  const [institutionName, setInstitutionName] = useState("");
  const [country, setCountry] = useState("Nigeria");

  const { login, signup } = useAuth();
  const { institution } = useInstitution();
  const navigate = useNavigate();

  const filteredDepts = institution.departmentList.filter(d => {
    const fac = institution.faculties.find(f => f.name === faculty);
    return fac ? d.facultyId === fac.id : false;
  });

  const getPostAuthRoute = (selectedRole: AppRole) => {
    switch (selectedRole) {
      case "Research Director": return "/admin/dashboard";
      case "Head of Department": return "/hod/dashboard";
      case "Supervisor": return "/supervisor/dashboard";
      case "Student": return "/app/student/dashboard";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login(email, password, role);
      navigate(getPostAuthRoute(role));
    } else {
      signup({
        name, email, role, studentCategory: role === "Student" ? studentCategory : undefined,
        matricId: role === "Student" ? matricId : undefined,
        faculty: ["Student", "Supervisor", "Head of Department"].includes(role) ? faculty : undefined,
        department: ["Student", "Supervisor", "Head of Department"].includes(role) ? department : undefined,
        programme: role === "Student" ? programme : undefined,
        projectType: role === "Student" ? projectType : undefined,
        academicTitle: role === "Supervisor" ? academicTitle : undefined,
      });
      navigate(getPostAuthRoute(role));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={cognitaLogo} alt="Cognita Logo" className="h-12 w-12 object-contain mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Welcome to Cognita</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "login" ? "Sign in to continue" : "Create your account"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-card">
          <div className="flex mb-6 border-b border-border">
            {(["login", "signup"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 pb-2 text-sm font-medium transition-colors border-b-2 -mb-px ${mode === m ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selection */}
            <div>
              <Label htmlFor="role">I am a…</Label>
              <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
                <SelectTrigger id="role" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Jane Doe" required />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {/* Role-specific fields (signup only) */}
            {mode === "signup" && role === "Student" && (
              <>
                <div>
                  <Label>Student Category</Label>
                  <Select value={studentCategory} onValueChange={(v) => setStudentCategory(v as StudentCategory)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STUDENT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Matric / Student ID</Label>
                  <Input value={matricId} onChange={(e) => setMatricId(e.target.value)} placeholder="UG/CS/2024/001" />
                </div>
                <div>
                  <Label>Faculty</Label>
                  <Select value={faculty} onValueChange={setFaculty}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select faculty" /></SelectTrigger>
                    <SelectContent>
                      {institution.faculties.map(f => <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Select value={department} onValueChange={setDepartment} disabled={!faculty}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {filteredDepts.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Programme / Field of Study</Label>
                  <Input value={programme} onChange={(e) => setProgramme(e.target.value)} placeholder="Computer Science" />
                </div>
                <div>
                  <Label>Project Type</Label>
                  <Select value={projectType} onValueChange={(v) => setProjectType(v as ProjectType)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {mode === "signup" && role === "Supervisor" && (
              <>
                <div>
                  <Label>Academic Title</Label>
                  <Select value={academicTitle} onValueChange={(v) => setAcademicTitle(v as AcademicTitle)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ACADEMIC_TITLES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Faculty</Label>
                  <Select value={faculty} onValueChange={setFaculty}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select faculty" /></SelectTrigger>
                    <SelectContent>
                      {institution.faculties.map(f => <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Select value={department} onValueChange={setDepartment} disabled={!faculty}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {filteredDepts.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {mode === "signup" && role === "Head of Department" && (
              <>
                <div>
                  <Label>Faculty</Label>
                  <Select value={faculty} onValueChange={setFaculty}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select faculty" /></SelectTrigger>
                    <SelectContent>
                      {institution.faculties.map(f => <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Select value={department} onValueChange={setDepartment} disabled={!faculty}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {filteredDepts.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {mode === "signup" && role === "Research Director" && (
              <>
                <div>
                  <Label>Institution Name</Label>
                  <Input value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} placeholder="Greenfield University" />
                </div>
                <div>
                  <Label>Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button type="submit" className="w-full">
              {mode === "login" ? "Login" : "Create Account"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo mode — select a role and click Login to explore.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
