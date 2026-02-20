import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ArchitectureDoc = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-doc { padding: 0 !important; max-width: 100% !important; }
          .print-doc h1 { font-size: 24pt !important; }
          .print-doc h2 { font-size: 16pt !important; page-break-before: always; }
          .print-doc h2:first-of-type { page-break-before: avoid; }
          .print-doc h3 { font-size: 13pt !important; }
          .print-doc table { font-size: 9pt !important; }
          .print-doc pre { font-size: 8pt !important; white-space: pre-wrap !important; }
        }
      `}</style>

      <div className="no-print sticky top-0 z-50 bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button onClick={handleDownload} size="sm">
          <Download className="h-4 w-4 mr-2" /> Download as PDF
        </Button>
      </div>

      <div className="print-doc max-w-4xl mx-auto px-8 py-12 text-foreground">
        <h1 className="text-4xl font-bold mb-2">Cognita — Full Architecture Summary</h1>
        <p className="text-muted-foreground mb-1 text-lg">Engineering Handoff Document</p>
        <p className="text-sm text-muted-foreground mb-8">Version 1.0 · Date: 2026-02-20 · Status: Prototype (Frontend-heavy, mock data)</p>
        <hr className="my-8 border-border" />

        {/* Section 1 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">1. Technology Stack</h2>
        <Table data={[
          ["Framework", "React 18 + TypeScript"],
          ["Build", "Vite"],
          ["Styling", "Tailwind CSS + shadcn/ui component library"],
          ["State", "React Context (Auth, Project, Institution) + TanStack Query"],
          ["Routing", "react-router-dom v6 (nested layouts)"],
          ["Charts", "Recharts"],
          ["Backend", "Lovable Cloud (Supabase) — Edge Functions, DB, Auth"],
          ["AI Gateway", "Lovable AI Gateway → Google Gemini 3 Flash Preview"],
          ["Markdown", "react-markdown"],
        ]} headers={["Layer", "Technology"]} />

        {/* Section 2 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">2. Route Architecture</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Public Routes</h3>
        <Table data={[
          ["/", "Landing.tsx", "Marketing page with hero, pricing, features"],
          ["/auth", "Auth.tsx", "Login / Signup with role selection"],
        ]} headers={["Route", "Component", "Purpose"]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Onboarding Routes (Post-Signup)</h3>
        <Table data={[
          ["/onboarding", "Onboarding.tsx", "Students & Researchers"],
          ["/supervisor-onboarding", "SupervisorOnboarding.tsx", "Supervisors — profile + add students"],
          ["/admin-onboarding", "AdminOnboarding.tsx", "Admins — institution setup (4 steps)"],
        ]} headers={["Route", "Component", "Target Role"]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Researcher Workspace (/app/:projectId/*)</h3>
        <p className="text-sm text-muted-foreground mb-2">Layout: AppLayout.tsx → AppSidebar.tsx + TopNav.tsx</p>
        <Table data={[
          ["dashboard", "Dashboard.tsx", "Project overview, progress, checklist"],
          ["editor", "Editor.tsx", "Section-based document editor with AI chat"],
          ["references", "References.tsx", "Reference manager (add, tag, validate DOI)"],
          ["ai-reviewer", "AIReviewer.tsx", "AI-powered document review"],
          ["data", "DataPage.tsx", "Dataset upload and preview"],
          ["analysis", "Analysis.tsx", "Statistical analysis workspace"],
          ["results", "Results.tsx", "Analysis results gallery"],
          ["export", "Export.tsx", "Export to DOCX/PDF/LaTeX"],
          ["plagiarism", "PlagiarismChecker.tsx", "Similarity & AI detection checker"],
          ["collaboration", "Collaboration.tsx", "Collaborator management"],
          ["settings", "Settings.tsx", "Project and account settings"],
        ]} headers={["Sub-route", "Component", "Feature"]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">2.4 Admin Dashboard (/admin/*)</h3>
        <p className="text-sm text-muted-foreground mb-2">Layout: AdminLayout.tsx → AdminSidebar.tsx</p>
        <Table data={[
          ["dashboard", "AdminDashboard.tsx", "Institutional KPIs, alerts"],
          ["projects", "AdminProjects.tsx", "All institutional research projects"],
          ["researchers", "AdminResearchers.tsx", "Researcher directory"],
          ["compliance", "AdminCompliance.tsx", "Integrity monitoring"],
          ["analytics", "AdminAnalytics.tsx", "Institutional analytics"],
          ["settings", "AdminSettings.tsx", "Institution configuration"],
        ]} headers={["Sub-route", "Component", "Feature"]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">2.5 Supervisor Dashboard (/supervisor/*)</h3>
        <p className="text-sm text-muted-foreground mb-2">Layout: SupervisorLayout.tsx → SupervisorSidebar.tsx</p>
        <Table data={[
          ["students", "SupervisorStudents.tsx", "Student list with progress"],
          ["students/:studentId", "StudentDetail.tsx", "Individual student detail"],
          ["overview", "SupervisorOverview.tsx", "Supervision KPIs"],
          ["notifications", "SupervisorNotifications.tsx", "Alerts and action items"],
        ]} headers={["Sub-route", "Component", "Feature"]} />

        {/* Section 3 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">3. Role System</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Role Definitions</h3>
        <Code>{`type AppRole =
  | "Undergraduate Student"
  | "Master's Student"
  | "PhD Student"
  | "Researcher"
  | "Supervisor"
  | "Research Director"
  | "Compliance Officer";`}</Code>

        <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Role Groups</h3>
        <Table data={[
          ["Undergraduate", "Undergraduate Student", "Researcher workspace"],
          ["Postgraduate", "Master's Student, PhD Student", "Researcher workspace"],
          ["Faculty", "Researcher, Supervisor", "Researcher / Supervisor dashboard"],
          ["Administration", "Research Director, Compliance Officer", "Admin dashboard"],
        ]} headers={["Group", "Roles", "Dashboard"]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Post-Auth Routing Logic</h3>
        <Code>{`const getPostAuthRoute = (selectedRole, isSignup) => {
  if (ADMIN_ROLES.includes(selectedRole))
    return isSignup ? "/admin-onboarding" : "/admin/dashboard";
  if (selectedRole === "Supervisor")
    return isSignup ? "/supervisor-onboarding" : "/supervisor/students";
  return isSignup ? "/onboarding" : "/app/proj-001/dashboard";
};`}</Code>

        {/* Section 4 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">4. Data Models</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Core: ResearchProject</h3>
        <Code>{`interface ResearchProject {
  id: string;
  title: string;
  subtitle: string;
  discipline: string;
  targetOutput: string;
  methodologyType: string;
  targetJournal: string;
  projectType: string;           // Maps to section template
  status: "draft" | "in-progress" | "review" | "submitted" | "exported";
  sections: Section[];
  sectionMeta: SectionMeta[];
  references: Reference[];
  dataFiles: DataFile[];
  dataset: Dataset;
  analysisResults: AnalysisResult[];
  reviewScores: ReviewScore[];
  reviewIssues: ReviewIssue[];
  collaborators: Collaborator[];
  checklist: ChecklistItem[];
  exports: ExportRecord[];
  activities: ActivityItem[];
  progress: number;              // 0-100
  wordCount: number;
  targetWordCount: number;
  integrityScore: number;        // 0-100
  aiUsageLevel: "None" | "Low" | "Moderate" | "High";
  aiMode: string;
}`}</Code>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Section & SectionMeta</h3>
        <Code>{`interface Section {
  id: string;       // Format: "tmpl-{key}"
  title: string;
  content: string;
  order: number;
}

interface SectionMeta {
  key: string;
  mandatory: boolean;
  enabled: boolean;
  parentKey?: string;
  approved?: boolean;
  supervisorComment?: string;
}`}</Code>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Institution Layer</h3>
        <Code>{`interface InstitutionData {
  name: string;
  totalResearchers: number;
  activeProjects: number;
  publicationsThisYear: number;
  projects: InstitutionalProject[];
  alerts: InstitutionAlert[];
  researchers: ResearcherProfile[];
  aiReviewsThisMonth: number;
  departments: string[];
}

interface InstitutionalProject {
  similarityIndex: number;
  aiDetectionScore: number;
  aiReviewHistory: { date: string; score: number }[];
  integrityIssues: string[];
  datasetStatus: "not-uploaded" | "uploaded" | "analyzed";
}`}</Code>

        {/* Section 5 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">5. Section Builder & Template Engine</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Supported Project Types (9)</h3>
        <Code>{`type ProjectType =
  | "Thesis" | "Dissertation" | "Research Proposal"
  | "Progress Report" | "Final Report" | "Journal Article"
  | "Review Article" | "Conference Paper" | "Grant Proposal";`}</Code>

        <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Template Structure</h3>
        <Code>{`interface TemplateSectionDef {
  key: string;
  title: string;
  mandatory: boolean;
  children?: TemplateSectionDef[];
}`}</Code>
        <p className="my-3 text-sm">Example — Thesis template (abbreviated):</p>
        <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed">{`Title Page (mandatory)
Declaration (mandatory)
Dedication (optional)
Abstract (mandatory)
Chapter 1: Introduction (mandatory)
  ├── 1.1 Background of the Study (mandatory)
  ├── 1.2 Statement of the Problem (mandatory)
  ├── 1.3 Research Questions (mandatory)
  ├── 1.4 Aim and Objectives (mandatory)
  ├── 1.5 Justification / Rationale (mandatory)
  ├── 1.6 Research Hypothesis (optional)
  ├── 1.7 Scope and Delimitations (mandatory)
  └── 1.8 Definition of Key Terms (optional)
Chapter 2: Literature Review (mandatory)
  ├── 2.1 Theoretical Framework (mandatory)
  └── ...
...
References (mandatory)
Appendices (optional)`}</pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Template Operations</h3>
        <Table data={[
          ["Switch template", "switchProjectType(type)", "Re-maps content to new template"],
          ["Toggle section", "toggleSectionEnabled(key)", "Enable/disable optional sections"],
          ["Add custom", "addCustomSection(title, afterKey?)", "Insert user-defined section"],
          ["Reorder", "reorderSections(from, to)", "Drag-and-drop reorder"],
          ["Approve", "approveSection(key)", "Supervisor toggle"],
          ["Comment", "commentOnSection(key, comment)", "Supervisor feedback"],
        ]} headers={["Operation", "Function", "Description"]} />

        {/* Section 6 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">6. AI Workflow</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">6.1 AI Chat Edge Function</h3>
        <p className="mb-2"><strong>Model:</strong> google/gemini-3-flash-preview via Lovable AI Gateway</p>
        <p className="mb-2"><strong>Context injection includes:</strong></p>
        <ul className="list-disc pl-6 space-y-1 text-sm mb-4">
          <li>Project title, discipline, methodology, target journal</li>
          <li>Active section title and content preview (first 500 chars)</li>
          <li>All section titles, word count, integrity score</li>
          <li>AI reviewer issues (severity, section, message, suggestion)</li>
          <li>Review scores by category</li>
        </ul>
        <p className="mb-2"><strong>Special output:</strong> Content for insertion wrapped in <code className="bg-muted px-1 rounded">&lt;insert-content&gt;</code> tags.</p>
        <p className="mb-4"><strong>Error handling:</strong> 429 → rate limit, 402 → credits exhausted, 500 → generic error.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">6.2 AI Reviewer</h3>
        <Table data={[
          ["critical", "Fundamental structural/methodological problems"],
          ["major", "Significant gaps or inconsistencies"],
          ["minor", "Style, formatting, minor clarity issues"],
          ["suggestion", "Enhancement opportunities"],
        ]} headers={["Severity", "Description"]} />

        {/* Section 7 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">7. Subscription & Pricing</h2>
        <Table data={[
          ["Cognita Basic", "Free", "1 project, 5 AI reviews/mo, basic export, 5MB"],
          ["Cognita Pro", "$14.99/mo", "Unlimited projects, 50 AI reviews/mo, all exports, 50MB"],
          ["Cognita Premium", "$29.99/mo", "Everything + advanced stats, real-time collab, priority AI"],
          ["Institutional", "Custom", "Unlimited seats, admin dashboard, compliance, SSO/LMS"],
        ]} headers={["Plan", "Monthly", "Features"]} />
        <p className="mt-3 text-sm text-amber-600 font-medium">⚠️ Prototype only — no payment gateway or feature gating implemented.</p>

        {/* Section 8 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">8. Integrity Scoring Logic</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">8.1 Composite Score Formula</h3>
        <Code>{`integrityScore = completeness * 0.4 + previousScore * 0.6

Where:
  completeness = (filled mandatory sections / total mandatory) × 100
  previousScore = existing score (provides smoothing)`}</Code>

        <h3 className="text-xl font-semibold mt-6 mb-3">8.2 Score Components (Institutional View)</h3>
        <Table data={[
          ["integrityScore", "Overall document integrity (0-100)", "Section completeness calculation"],
          ["similarityIndex", "Plagiarism/similarity %", "Plagiarism checker (mock)"],
          ["aiDetectionScore", "AI-generated content %", "AI detection module (mock)"],
          ["aiUsageLevel", "None / Low / Moderate / High", "AI interaction frequency"],
        ]} headers={["Metric", "Description", "Source"]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">8.3 Compliance Tracking</h3>
        <Code>{`getComplianceStats() → {
  total: number,    // Enabled mandatory sections
  missing: number,  // Mandatory sections not in document
  empty: number,    // Mandatory sections with no content
  approved: number  // Sections approved by supervisor
}`}</Code>

        {/* Section 9 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">9. State Management</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">9.1 Provider Nesting</h3>
        <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed">{`QueryClientProvider
  └── AuthProvider            ← User identity & role
       └── ProjectProvider    ← Active research project
            └── InstitutionProvider  ← Institution data (admin)
                 └── TooltipProvider
                      └── BrowserRouter`}</pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">9.2 AuthContext</h3>
        <Table data={[
          ["user", "User | null", "Current user object"],
          ["role", "AppRole", "Active role"],
          ["isAdmin", "boolean", "Derived from ADMIN_ROLES"],
          ["login()", "Function", "Sets mock user based on role"],
          ["signup()", "Function", "Creates mock user"],
          ["switchRole()", "Function", "Hot-swap role (dev/demo)"],
        ]} headers={["Field", "Type", "Description"]} />

        {/* Section 10 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">10. Component Architecture</h2>
        <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed">{`src/components/
├── layout/                    # 10 layout components
│   ├── AppLayout.tsx          # Researcher workspace shell
│   ├── AdminLayout.tsx        # Admin workspace shell
│   ├── SupervisorLayout.tsx   # Supervisor workspace shell
│   ├── TopNav.tsx             # Top nav (role-aware)
│   └── ProjectContextDrawer   # Right sidebar (role-aware)
├── editor/
│   ├── AIChatPanel.tsx        # AI chat with streaming
│   └── SectionBuilder.tsx     # Section list management
├── analysis/
│   ├── AITestAdvisor.tsx      # Statistical test recommender
│   ├── DataInputHub.tsx       # Dataset upload/preview
│   ├── ResearchContextSetup   # Analysis config
│   └── StatisticalResultsPanel
├── landing/                   # 8 marketing sections
└── ui/                        # 45+ shadcn/ui components`}</pre>

        {/* Section 11 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">11. Data Sources (Mock)</h2>
        <Table data={[
          ["mockProject.ts", "Default ResearchProject + mock users"],
          ["mockInstitution.ts", "InstitutionData for admin dashboard"],
          ["mockSupervisor.ts", "Supervised students data"],
          ["sectionTemplates.ts", "All 9 project type templates (433 lines)"],
        ]} headers={["File", "Provides"]} />

        {/* Section 12 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">12. Backend (Lovable Cloud)</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">12.1 Edge Functions</h3>
        <Table data={[
          ["ai-chat", "POST /ai-chat", "Streaming AI chat with project context"],
        ]} headers={["Function", "Endpoint", "Purpose"]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">12.2 Database Migration Priorities</h3>
        <ol className="list-decimal pl-6 space-y-1 text-sm">
          <li>Users & Profiles — profiles table linked to auth.users</li>
          <li>Projects — projects table with RLS per user</li>
          <li>Sections — sections table (FK to projects)</li>
          <li>References — references table (FK to projects)</li>
          <li>Datasets — Storage bucket + datasets metadata table</li>
          <li>Institutions — institutions, faculties, departments tables</li>
          <li>Supervision — supervisor_students junction table</li>
          <li>Collaboration — project_collaborators junction table</li>
          <li>Exports — export_history table</li>
          <li>Analytics — activity_log table</li>
        </ol>

        {/* Section 13 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">13. Export System</h2>
        <Table data={[
          ["DOCX", "Simulated (mock download)"],
          ["PDF", "Simulated (mock download)"],
          ["LaTeX", "Simulated (mock download)"],
        ]} headers={["Format", "Implementation"]} />
        <p className="mt-3 text-sm"><strong>Options:</strong> Citation style (APA 7th, IEEE, Chicago, Harvard, Vancouver, MLA), cover page toggle, TOC toggle, embedded figures toggle.</p>

        {/* Section 14 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">14. Engineering Decisions & Trade-offs</h2>
        <Table data={[
          ["Mock data everywhere", "Rapid prototyping", "Must replace for production"],
          ["Single ProjectContext", "Simple state for prototype", "Won't scale — needs DB queries"],
          ["Role in AuthContext only", "No DB enforcement", "Needs RLS policies per role"],
          ["No real auth", "Demo-friendly", "Must implement Supabase Auth"],
          ["AI via edge function", "Secure key management", "Single point of failure"],
          ["Templates as code", "Easy to iterate", "Should become DB-driven"],
        ]} headers={["Decision", "Rationale", "Risk"]} />

        {/* Section 15 */}
        <h2 className="text-2xl font-bold mt-10 mb-4">15. File Tree</h2>
        <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed">{`src/
├── App.tsx                    # Root router
├── main.tsx                   # Entry point
├── index.css                  # Design tokens & global styles
├── assets/                    # Images (logo, hero bg)
├── components/
│   ├── layout/                # 10 layout components
│   ├── landing/               # 8 marketing page sections
│   ├── editor/                # 2 editor components
│   ├── analysis/              # 4 analysis components
│   ├── ui/                    # 45+ shadcn/ui components
│   └── NavLink.tsx
├── context/                   # Auth, Project, Institution
├── data/                      # Mock data + section templates
├── hooks/                     # use-mobile, use-toast
├── integrations/supabase/     # Auto-generated (DO NOT EDIT)
├── pages/
│   ├── app/                   # 11 researcher pages
│   ├── admin/                 # 6 admin pages
│   └── supervisor/            # 4 supervisor pages
├── types/research.ts          # 238 lines, all types
└── lib/utils.ts
supabase/
├── config.toml
└── functions/ai-chat/index.ts`}</pre>

        <hr className="my-8 border-border" />
        <p className="text-center text-sm text-muted-foreground italic">End of Architecture Document</p>
      </div>
    </>
  );
};

/* ── Helper Components ── */

const Table = ({ headers, data }: { headers: string[]; data: string[][] }) => (
  <div className="overflow-x-auto my-4">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-muted">
          {headers.map((h, i) => (
            <th key={i} className="text-left px-3 py-2 font-semibold border border-border">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 1 ? "bg-muted/50" : ""}>
            {row.map((cell, ci) => (
              <td key={ci} className="px-3 py-2 border border-border">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Code = ({ children }: { children: string }) => (
  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto font-mono my-4 leading-relaxed">{children}</pre>
);

export default ArchitectureDoc;
