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
                <Route path="/admin-onboarding" element={<AdminOnboarding />} />

                {/* Researcher Workspace */}
                <Route path="/app/:projectId" element={<AppLayout />}>
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
                  <Route path="collaboration" element={<Collaboration />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Legacy redirect */}
                <Route path="/app" element={<Navigate to="/app/proj-001/dashboard" replace />} />
                <Route path="/app/dashboard" element={<Navigate to="/app/proj-001/dashboard" replace />} />

                {/* Institution Dashboard */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="researchers" element={<AdminResearchers />} />
                  <Route path="compliance" element={<AdminCompliance />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Supervisor Dashboard */}
                <Route path="/supervisor" element={<SupervisorLayout />}>
                  <Route index element={<Navigate to="students" replace />} />
                  <Route path="students" element={<SupervisorStudents />} />
                  <Route path="students/:studentId" element={<StudentDetail />} />
                  <Route path="overview" element={<SupervisorOverview />} />
                  <Route path="notifications" element={<SupervisorNotifications />} />
                </Route>

                {/* HOD Dashboard */}
                <Route path="/hod" element={<HodLayout />}>
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<HodOverview />} />
                  <Route path="supervisors" element={<HodSupervisors />} />
                  <Route path="students" element={<HodStudents />} />
                  <Route path="settings" element={<HodSettings />} />
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
