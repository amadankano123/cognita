import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProjectProvider } from "@/context/ProjectContext";
import { InstitutionProvider } from "@/context/InstitutionContext";
import { InstitutionConfigProvider } from "@/context/InstitutionConfigContext";
import { AuditProvider } from "@/context/AuditContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { Building2, Crown, GraduationCap, Gavel, LayoutDashboard, Users, FolderKanban, ScrollText, BarChart3, Award, FileText } from "lucide-react";
import RoleShell from "@/components/layout/RoleShell";
import DeanOverview from "./pages/dean/DeanOverview";

import VcOverview from "./pages/vc/VcOverview";
import ExaminerQueue from "./pages/examiner/ExaminerQueue";
import ExaminerDashboard from "./pages/examiner/ExaminerDashboard";
import SpgsDashboard from "./pages/spgs/SpgsDashboard";
import SpgsStudents from "./pages/spgs/SpgsStudents";
import SpgsAnalytics from "./pages/spgs/SpgsAnalytics";
import SpgsSenate from "./pages/spgs/SpgsSenate";
import SpgsReports from "./pages/spgs/SpgsReports";
import AuditLogPage from "./pages/admin/AuditLogPage";
import RequireRole from "@/components/auth/RequireRole";
import { STUDENT_ROLES, ADMIN_ROLES, REVIEW_ROLES } from "@/types/research";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ArchitectureDoc from "./pages/ArchitectureDoc";
import Onboarding from "./pages/Onboarding";
import SupervisorOnboarding from "./pages/SupervisorOnboarding";
import HodOnboarding from "./pages/HodOnboarding";
import AdminOnboarding from "./pages/AdminOnboarding";
import NotFound from "./pages/NotFound";

import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Editor from "./pages/app/Editor";
import References from "./pages/app/References";
import AIReviewer from "./pages/app/AIReviewer";
import DataPage from "./pages/app/DataPage";
import Analysis from "./pages/app/Analysis";
import Results from "./pages/app/Results";
import Export from "./pages/app/Export";
import Collaboration from "./pages/app/Collaboration";
import Settings from "./pages/app/Settings";
import PlagiarismChecker from "./pages/app/PlagiarismChecker";
import Messages from "./pages/app/Messages";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminResearchers from "./pages/admin/AdminResearchers";
import AdminCompliance from "./pages/admin/AdminCompliance";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

import SupervisorLayout from "@/components/layout/SupervisorLayout";
import SupervisorStudents from "./pages/supervisor/SupervisorStudents";
import SupervisorOverview from "./pages/supervisor/SupervisorOverview";
import SupervisorNotifications from "./pages/supervisor/SupervisorNotifications";
import SupervisorReviews from "./pages/supervisor/SupervisorReviews";
import SupervisorApprovals from "./pages/supervisor/SupervisorApprovals";
import SupervisorAnalytics from "./pages/supervisor/SupervisorAnalytics";
import SupervisorMessages from "./pages/supervisor/SupervisorMessages";
import SupervisorSettings from "./pages/supervisor/SupervisorSettings";
import StudentDetail from "./pages/supervisor/StudentDetail";

import HodLayout from "@/components/layout/HodLayout";
import HodOverview from "./pages/hod/HodOverview";
import HodSupervisors from "./pages/hod/HodSupervisors";
import HodStudents from "./pages/hod/HodStudents";
import HodSettings from "./pages/hod/HodSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProjectProvider>
        <InstitutionProvider>
          <InstitutionConfigProvider>
            <AuditProvider>
              <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/architecture" element={<ArchitectureDoc />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/supervisor-onboarding" element={<SupervisorOnboarding />} />
                <Route path="/hod-onboarding" element={<HodOnboarding />} />
                <Route path="/admin-onboarding" element={<AdminOnboarding />} />

                {/* Researcher Workspace */}
                <Route path="/app/:projectId" element={<RequireRole allow={[...STUDENT_ROLES, "Researcher"]}><AppLayout /></RequireRole>}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="editor" element={<Editor />} />
                  <Route path="references" element={<References />} />
                  <Route path="ai-reviewer" element={<AIReviewer />} />
                  <Route path="data" element={<DataPage />} />
                  <Route path="analysis" element={<Analysis />} />
                  <Route path="results" element={<Results />} />
                  <Route path="export" element={<Export />} />
                  <Route path="plagiarism" element={<PlagiarismChecker />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="collaboration" element={<Collaboration />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Legacy redirect */}
                <Route path="/app" element={<Navigate to="/app/proj-001/dashboard" replace />} />
                <Route path="/app/dashboard" element={<Navigate to="/app/proj-001/dashboard" replace />} />

                {/* Institution Dashboard — Director of Research */}
                <Route path="/admin" element={<RequireRole allow={ADMIN_ROLES}><AdminLayout /></RequireRole>}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="researchers" element={<AdminResearchers />} />
                  <Route path="compliance" element={<AdminCompliance />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="audit" element={<AuditLogPage />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Supervisor Dashboard */}
                <Route path="/supervisor" element={<RequireRole allow={["Supervisor"]}><SupervisorLayout /></RequireRole>}>
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<SupervisorOverview />} />
                  <Route path="students" element={<SupervisorStudents />} />
                  <Route path="students/:studentId" element={<StudentDetail />} />
                  <Route path="reviews" element={<SupervisorReviews />} />
                  <Route path="approvals" element={<SupervisorApprovals />} />
                  <Route path="analytics" element={<SupervisorAnalytics />} />
                  <Route path="notifications" element={<SupervisorNotifications />} />
                  <Route path="messages" element={<SupervisorMessages />} />
                  <Route path="settings" element={<SupervisorSettings />} />
                </Route>

                {/* HOD Dashboard */}
                <Route path="/hod" element={<RequireRole allow={["Head of Department"]}><HodLayout /></RequireRole>}>
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<HodOverview />} />
                  <Route path="supervisors" element={<HodSupervisors />} />
                  <Route path="students" element={<HodStudents />} />
                  <Route path="settings" element={<HodSettings />} />
                </Route>

                {/* Dean of Faculty */}
                <Route path="/dean" element={<RequireRole allow={["Dean"]}><RoleShell roleLabel="Dean" roleIcon={Building2} items={[
                  { title: "Dashboard", path: "/dean/dashboard", icon: LayoutDashboard },
                  { title: "Departments", path: "/dean/dashboard", icon: Building2 },
                  { title: "Audit Trail", path: "/dean/audit", icon: ScrollText },
                ]} /></RequireRole>}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DeanOverview />} />
                  <Route path="overview" element={<Navigate to="/dean/dashboard" replace />} />
                  <Route path="audit" element={<AuditLogPage />} />
                </Route>

                {/* Legacy redirect: PG Coordinator role removed — route to SPGS oversight */}
                <Route path="/pg-coordinator/*" element={<Navigate to="/spgs/dashboard" replace />} />

                {/* Vice Chancellor */}
                <Route path="/vc" element={<RequireRole allow={["Vice Chancellor"]}><RoleShell roleLabel="Vice Chancellor" roleIcon={Crown} items={[
                  { title: "Dashboard", path: "/vc/dashboard", icon: LayoutDashboard },
                  { title: "Audit Trail", path: "/vc/audit", icon: ScrollText },
                ]} /></RequireRole>}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<VcOverview />} />
                  <Route path="overview" element={<Navigate to="/vc/dashboard" replace />} />
                  <Route path="audit" element={<AuditLogPage />} />
                </Route>

                {/* Examiner (External / Internal) */}
                <Route path="/examiner" element={<RequireRole allow={REVIEW_ROLES}><RoleShell roleLabel="Examiner" roleIcon={Gavel} items={[
                  { title: "Dashboard", path: "/examiner/dashboard", icon: LayoutDashboard },
                  { title: "Examination Queue", path: "/examiner/queue", icon: FolderKanban },
                ]} /></RequireRole>}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<ExaminerDashboard />} />
                  <Route path="queue" element={<ExaminerQueue />} />
                </Route>

                {/* SPGS — School of Postgraduate Studies oversight */}
                <Route path="/spgs" element={<RequireRole allow={["SPGS Dean"]}><RoleShell roleLabel="SPGS Dean" roleIcon={GraduationCap} items={[
                  { title: "Dashboard", path: "/spgs/dashboard", icon: LayoutDashboard },
                  { title: "PG Students", path: "/spgs/students", icon: Users },
                  { title: "Analytics", path: "/spgs/analytics", icon: BarChart3 },
                  { title: "Senate Readiness", path: "/spgs/senate", icon: Award },
                  { title: "Reports", path: "/spgs/reports", icon: FileText },
                  { title: "Audit Trail", path: "/spgs/audit", icon: ScrollText },
                ]} /></RequireRole>}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<SpgsDashboard />} />
                  <Route path="students" element={<SpgsStudents />} />
                  <Route path="analytics" element={<SpgsAnalytics />} />
                  <Route path="senate" element={<SpgsSenate />} />
                  <Route path="reports" element={<SpgsReports />} />
                  <Route path="audit" element={<AuditLogPage />} />
                </Route>

                {/* Legacy redirect: /ethics → examiner queue */}
                <Route path="/ethics/*" element={<Navigate to="/examiner/queue" replace />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
              </NotificationProvider>
            </AuditProvider>
          </InstitutionConfigProvider>
        </InstitutionProvider>
      </ProjectProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
