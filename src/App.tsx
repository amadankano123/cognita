import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProjectProvider } from "@/context/ProjectContext";
import { InstitutionProvider } from "@/context/InstitutionContext";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ArchitectureDoc from "./pages/ArchitectureDoc";
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
import Settings from "./pages/app/Settings";
import PlagiarismChecker from "./pages/app/PlagiarismChecker";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFaculties from "./pages/admin/AdminFaculties";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminCompliance from "./pages/admin/AdminCompliance";
import AdminSettings from "./pages/admin/AdminSettings";

import SupervisorLayout from "@/components/layout/SupervisorLayout";
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";
import SupervisorStudents from "./pages/supervisor/SupervisorStudents";
import SupervisorReviews from "./pages/supervisor/SupervisorReviews";
import SupervisorProfile from "./pages/supervisor/SupervisorProfile";
import StudentDetail from "./pages/supervisor/StudentDetail";

import HodLayout from "@/components/layout/HodLayout";
import HodDashboard from "./pages/hod/HodDashboard";
import HodStudents from "./pages/hod/HodStudents";
import HodSupervisors from "./pages/hod/HodSupervisors";
import HodAssignments from "./pages/hod/HodAssignments";
import HodProjects from "./pages/hod/HodProjects";
import HodSettings from "./pages/hod/HodSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProjectProvider>
        <InstitutionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/architecture" element={<ArchitectureDoc />} />
                <Route path="/auth" element={<Auth />} />

                {/* Student Workspace */}
                <Route path="/app/student" element={<AppLayout />}>
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
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Legacy redirects */}
                <Route path="/app" element={<Navigate to="/app/student/dashboard" replace />} />
                <Route path="/app/dashboard" element={<Navigate to="/app/student/dashboard" replace />} />
                <Route path="/app/:projectId/*" element={<Navigate to="/app/student/dashboard" replace />} />

                {/* Institution Admin */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="faculties" element={<AdminFaculties />} />
                  <Route path="departments" element={<AdminDepartments />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="compliance" element={<AdminCompliance />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* HOD Dashboard */}
                <Route path="/hod" element={<HodLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<HodDashboard />} />
                  <Route path="students" element={<HodStudents />} />
                  <Route path="supervisors" element={<HodSupervisors />} />
                  <Route path="assignments" element={<HodAssignments />} />
                  <Route path="projects" element={<HodProjects />} />
                  <Route path="settings" element={<HodSettings />} />
                </Route>

                {/* Supervisor Dashboard */}
                <Route path="/supervisor" element={<SupervisorLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<SupervisorDashboard />} />
                  <Route path="students" element={<SupervisorStudents />} />
                  <Route path="students/:studentId" element={<StudentDetail />} />
                  <Route path="reviews" element={<SupervisorReviews />} />
                  <Route path="profile" element={<SupervisorProfile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </InstitutionProvider>
      </ProjectProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
