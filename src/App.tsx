import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProjectProvider } from "@/context/ProjectContext";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProjectProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/app" element={<AppLayout />}>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProjectProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
