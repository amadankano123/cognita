# Cognita — Full Architecture Summary
### Engineering Handoff Document
**Version:** 1.0 · **Date:** 2026-02-20 · **Status:** Prototype (Frontend-heavy, mock data)

---

## 1. Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui component library |
| State | React Context (Auth, Project, Institution) + TanStack Query |
| Routing | react-router-dom v6 (nested layouts) |
| Charts | Recharts |
| Backend | Lovable Cloud (Supabase) — Edge Functions, DB, Auth |
| AI Gateway | Lovable AI Gateway → Google Gemini 3 Flash Preview |
| Markdown | react-markdown |

---

## 2. Route Architecture

### 2.1 Public Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Landing.tsx` | Marketing page with hero, pricing, feature sections |
| `/auth` | `Auth.tsx` | Login / Signup with role selection |

### 2.2 Onboarding Routes (Post-Signup)

| Route | Component | Target Role |
|-------|-----------|-------------|
| `/onboarding` | `Onboarding.tsx` | Students & Researchers — project setup wizard |
| `/supervisor-onboarding` | `SupervisorOnboarding.tsx` | Supervisors — profile + add students (3 steps) |
| `/admin-onboarding` | `AdminOnboarding.tsx` | Admins — institution setup (4 steps: info, degrees, faculties, review) |

### 2.3 Researcher Workspace (`/app/:projectId/*`)

**Layout:** `AppLayout.tsx` → `AppSidebar.tsx` + `TopNav.tsx`

| Sub-route | Component | Feature |
|-----------|-----------|---------|
| `dashboard` | `Dashboard.tsx` | Project overview, progress, checklist |
| `editor` | `Editor.tsx` | Section-based document editor with AI chat panel |
| `references` | `References.tsx` | Reference manager (add, tag, validate DOI) |
| `ai-reviewer` | `AIReviewer.tsx` | AI-powered document review with severity scoring |
| `data` | `DataPage.tsx` | Dataset upload and preview |
| `analysis` | `Analysis.tsx` | Statistical analysis workspace (data input, AI advisor, results) |
| `results` | `Results.tsx` | Analysis results gallery |
| `export` | `Export.tsx` | Export to DOCX/PDF/LaTeX with citation style config |
| `plagiarism` | `PlagiarismChecker.tsx` | Similarity & AI detection checker |
| `collaboration` | `Collaboration.tsx` | Collaborator management |
| `settings` | `Settings.tsx` | Project and account settings |

### 2.4 Admin/Institution Dashboard (`/admin/*`)

**Layout:** `AdminLayout.tsx` → `AdminSidebar.tsx`

| Sub-route | Component | Feature |
|-----------|-----------|---------|
| `dashboard` | `AdminDashboard.tsx` | Institutional KPIs, alerts, compliance overview |
| `projects` | `AdminProjects.tsx` | All institutional research projects |
| `researchers` | `AdminResearchers.tsx` | Researcher directory and profiles |
| `compliance` | `AdminCompliance.tsx` | Integrity monitoring, flagged projects |
| `analytics` | `AdminAnalytics.tsx` | Institutional research analytics |
| `settings` | `AdminSettings.tsx` | Institution configuration |

### 2.5 Supervisor Dashboard (`/supervisor/*`)

**Layout:** `SupervisorLayout.tsx` → `SupervisorSidebar.tsx`

| Sub-route | Component | Feature |
|-----------|-----------|---------|
| `students` | `SupervisorStudents.tsx` | Student list with progress tracking |
| `students/:studentId` | `StudentDetail.tsx` | Individual student project detail |
| `overview` | `SupervisorOverview.tsx` | Supervision KPIs and workload |
| `notifications` | `SupervisorNotifications.tsx` | Alerts and action items |

### 2.6 Legacy Redirects

```
/app → /app/proj-001/dashboard
/app/dashboard → /app/proj-001/dashboard
```

---

## 3. Role System

### 3.1 Role Definitions (`src/types/research.ts`)

```typescript
type AppRole =
  | "Undergraduate Student"
  | "Master's Student"
  | "PhD Student"
  | "Researcher"
  | "Supervisor"
  | "Head of Department"
  | "PG Coordinator"
  | "Dean"
  | "Director of Research"
  | "Vice Chancellor"
  | "External Examiner"
  | "Internal Examiner";
```

### 3.2 Role Groups

| Group | Roles | Dashboard |
|-------|-------|-----------|
| Undergraduate | Undergraduate Student | Researcher workspace |
| Postgraduate | Master's Student, PhD Student | Researcher workspace |
| Faculty | Researcher, Supervisor | Researcher workspace / Supervisor dashboard |
| Department & Faculty Leadership | Head of Department, PG Coordinator, Dean | HOD / PG Coordinator / Dean dashboards |
| Review & Governance | External Examiner, Internal Examiner | Examiner queue |
| Administration | Director of Research, Vice Chancellor | Admin dashboard / VC executive view |

### 3.3 Post-Auth Routing Logic (`Auth.tsx`)

```typescript
const getPostAuthRoute = (selectedRole: AppRole, isSignup: boolean) => {
  if (ADMIN_ROLES.includes(selectedRole))
    return isSignup ? "/admin-onboarding" : "/admin/dashboard";
  if (selectedRole === "Supervisor")
    return isSignup ? "/supervisor-onboarding" : "/supervisor/students";
  return isSignup ? "/onboarding" : "/app/proj-001/dashboard";
};
```

### 3.4 Context-Aware Right Sidebar (`ProjectContextDrawer.tsx`)

The drawer renders role-specific content:
- **Researcher:** Project metadata, references count, section word counts
- **Supervisor:** Student counts by degree level, average progress, critical alerts
- **Admin:** Institutional stats, active projects, system alerts

---

## 4. Data Models (`src/types/research.ts`)

### 4.1 Core: `ResearchProject`

```typescript
interface ResearchProject {
  id: string;
  title: string;
  subtitle: string;
  discipline: string;
  targetOutput: string;           // e.g., "Journal Article"
  methodologyType: string;        // e.g., "Quantitative"
  targetJournal: string;
  projectType: string;            // Maps to section template
  status: "draft" | "in-progress" | "review" | "submitted" | "exported";
  sections: Section[];
  sectionMeta: SectionMeta[];     // Enable/disable, approval, comments
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
  progress: number;               // 0-100
  wordCount: number;
  targetWordCount: number;
  integrityScore: number;         // 0-100
  aiUsageLevel: "None" | "Low" | "Moderate" | "High";
  aiMode: string;
}
```

### 4.2 Section Model

```typescript
interface Section {
  id: string;       // Format: "tmpl-{key}"
  title: string;
  content: string;
  order: number;
}

interface SectionMeta {
  key: string;
  mandatory: boolean;
  enabled: boolean;
  parentKey?: string;     // For nested sections (e.g., 1.1 under Chapter 1)
  approved?: boolean;     // Supervisor approval flag
  supervisorComment?: string;
}
```

### 4.3 Reference

```typescript
interface Reference {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  doi?: string;
  tags: string[];
  abstract?: string;
  status?: "valid" | "missing-doi" | "unchecked";
  cited?: boolean;
}
```

### 4.4 Analysis & Results

```typescript
interface AnalysisResult {
  id: string;
  title: string;
  type: string;
  status: "pending" | "running" | "completed" | "failed";
  summary?: string;
  rSquared?: number;
  pValue?: number;
  interpretation?: string;
}
```

### 4.5 Institution Layer

```typescript
interface InstitutionData {
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
  // Extends project with institutional metrics
  similarityIndex: number;
  aiDetectionScore: number;
  aiReviewHistory: { date: string; score: number }[];
  integrityIssues: string[];
  datasetStatus: "not-uploaded" | "uploaded" | "analyzed";
}
```

---

## 5. Section Builder & Template Engine

### 5.1 Supported Project Types (9 total)

```typescript
type ProjectType =
  | "Thesis" | "Dissertation" | "Research Proposal"
  | "Progress Report" | "Final Report" | "Journal Article"
  | "Review Article" | "Conference Paper" | "Grant Proposal";
```

### 5.2 Template Structure (`src/data/sectionTemplates.ts`)

Each project type maps to a hierarchical array of `TemplateSectionDef`:

```typescript
interface TemplateSectionDef {
  key: string;           // Unique identifier
  title: string;         // Display name
  mandatory: boolean;    // Required for compliance
  children?: TemplateSectionDef[];  // Nested sub-sections
}
```

**Example — Thesis template (abbreviated):**

```
Title Page (mandatory)
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
  ├── 2.2 Conceptual Framework (optional)
  ├── 2.3 Empirical Review (mandatory)
  └── 2.4 Research Gap (mandatory)
...
References (mandatory)
Appendices (optional)
```

### 5.3 Template Operations (ProjectContext)

| Operation | Function | Description |
|-----------|----------|-------------|
| Switch template | `switchProjectType(type)` | Re-maps existing content to new template structure |
| Toggle section | `toggleSectionEnabled(key)` | Enable/disable optional sections |
| Add custom | `addCustomSection(title, afterKey?)` | Insert user-defined section |
| Reorder | `reorderSections(from, to)` | Drag-and-drop reorder |
| Approve | `approveSection(key)` | Supervisor toggle |
| Comment | `commentOnSection(key, comment)` | Supervisor feedback |

### 5.4 Content Preservation on Template Switch

`mapSectionsToTemplate()` maps existing section content to the new template by matching section IDs. Content from the old template is carried forward where keys match; new sections start empty.

---

## 6. AI Workflow

### 6.1 AI Chat (Edge Function: `supabase/functions/ai-chat/index.ts`)

**Model:** `google/gemini-3-flash-preview` via Lovable AI Gateway

**Context injection:** The system prompt receives:
- Project title, discipline, methodology, target journal
- Active section title and content preview (first 500 chars)
- All section titles
- Word count / target word count
- Integrity score
- AI reviewer issues (severity, section, message, suggestion)
- Review scores by category

**Special output format:**
- Content meant for insertion is wrapped in `<insert-content>` tags
- The UI parses these to offer an "Insert into section" button

**Error handling:**
- `429` → Rate limit message
- `402` → Credits exhausted message
- `500` → Generic AI service error

### 6.2 AI Reviewer (`AIReviewer.tsx`)

Generates `ReviewIssue[]` with severity levels:
- `critical` — Fundamental structural/methodological problems
- `major` — Significant gaps or inconsistencies
- `minor` — Style, formatting, minor clarity issues
- `suggestion` — Enhancement opportunities

Produces `ReviewScore[]` by category (e.g., Structure, Methodology, Writing Quality).

### 6.3 AI Test Advisor (`AITestAdvisor.tsx`)

Statistical analysis component that recommends appropriate tests based on:
- Research design (experimental, correlational, etc.)
- Variable types and count
- Sample size
- Data distribution assumptions

---

## 7. Subscription & Pricing Model

### 7.1 Individual Plans

| Plan | Monthly | Features |
|------|---------|----------|
| **Cognita Basic** | Free | 1 project, 5 AI reviews/mo, basic export, 5MB data |
| **Cognita Pro** | $14.99/mo | Unlimited projects, 50 AI reviews/mo, all exports, 50MB |
| **Cognita Premium** | $29.99/mo | Everything + advanced stats, real-time collab, priority AI |

### 7.2 Institutional Plan

| Plan | Pricing |
|------|---------|
| **Cognita Institutional** | Custom (contact sales) |

Features: Unlimited seats, admin dashboard, compliance monitoring, SSO/LMS integration, dedicated support.

### 7.3 Current Implementation Status

> ⚠️ **Prototype only.** Pricing is rendered as UI in `PricingSection.tsx`. No payment gateway, subscription enforcement, or feature gating is implemented. All features are accessible to all users.

---

## 8. Integrity Scoring Logic

### 8.1 Composite Score Formula

```typescript
integrityScore = completeness * 0.4 + previousScore * 0.6
```

Where:
- `completeness` = (filled mandatory sections / total mandatory sections) × 100
- `previousScore` = existing integrity score (provides stability/smoothing)

### 8.2 Score Components (Institutional View)

| Metric | Description | Source |
|--------|-------------|--------|
| `integrityScore` | Overall document integrity (0-100) | Calculated from section completeness |
| `similarityIndex` | Plagiarism/similarity percentage | Plagiarism checker (mock) |
| `aiDetectionScore` | AI-generated content percentage | AI detection module (mock) |
| `aiUsageLevel` | Categorical: None / Low / Moderate / High | Derived from AI interaction frequency |

### 8.3 Compliance Tracking (`getComplianceStats()`)

```typescript
{
  total: number,    // Enabled mandatory sections
  missing: number,  // Mandatory sections not in document
  empty: number,    // Mandatory sections with no content
  approved: number  // Sections approved by supervisor
}
```

---

## 9. State Management Architecture

### 9.1 Context Providers (nested in `App.tsx`)

```
QueryClientProvider
  └── AuthProvider          ← User identity & role
       └── ProjectProvider  ← Active research project state
            └── InstitutionProvider  ← Institution-level data (admin)
                 └── TooltipProvider
                      └── BrowserRouter
```

### 9.2 AuthContext

| Field | Type | Description |
|-------|------|-------------|
| `user` | `User \| null` | Current user object |
| `role` | `AppRole` | Active role |
| `isAdmin` | `boolean` | Derived from `ADMIN_ROLES.includes(role)` |
| `login()` | Function | Sets mock user based on role |
| `signup()` | Function | Creates mock user with provided details |
| `switchRole()` | Function | Hot-swap role (dev/demo feature) |

### 9.3 ProjectContext

Manages the entire `ResearchProject` state with 13 mutation functions (see Section 5.3 for template operations). All mutations use `useCallback` and immutable state updates.

### 9.4 InstitutionContext

Provides `InstitutionData` from `mockInstitution.ts` for the admin dashboard.

---

## 10. Component Architecture

### 10.1 Layout Components

```
src/components/layout/
├── AppLayout.tsx              # Researcher workspace shell
├── AppSidebar.tsx             # Researcher nav sidebar
├── AdminLayout.tsx            # Admin workspace shell
├── AdminSidebar.tsx           # Admin nav sidebar
├── SupervisorLayout.tsx       # Supervisor workspace shell
├── SupervisorSidebar.tsx      # Supervisor nav sidebar
├── TopNav.tsx                 # Top navigation bar (role-aware)
├── PageHeader.tsx             # Page title + breadcrumb
├── ProjectContextDrawer.tsx   # Right sidebar (role-aware summary)
└── ContextAwareIndicator.tsx  # Visual role indicator
```

### 10.2 Feature Components

```
src/components/editor/
├── AIChatPanel.tsx            # AI chat with streaming responses
└── SectionBuilder.tsx         # Section list with enable/disable/reorder

src/components/analysis/
├── AITestAdvisor.tsx          # Statistical test recommender
├── DataInputHub.tsx           # Dataset upload and preview
├── ResearchContextSetup.tsx   # Analysis configuration
└── StatisticalResultsPanel.tsx # Results display

src/components/landing/
├── AudienceSection.tsx        # Target audience cards
├── ComparisonQuotesSection.tsx # Testimonials / comparisons
├── PlagiarismSection.tsx      # Plagiarism feature showcase
├── PricingSection.tsx         # Pricing tiers (4 plans)
├── ProblemSection.tsx         # Pain points
├── SolutionSection.tsx        # Product solution
├── StatsAnalysisSection.tsx   # Statistics feature showcase
└── ToolsReplacedSection.tsx   # Competitor comparison
```

### 10.3 UI Component Library

Full shadcn/ui installation with 45+ components including: accordion, alert-dialog, avatar, badge, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toggle, tooltip.

---

## 11. Data Sources (Current: Mock)

| File | Provides |
|------|----------|
| `src/data/mockProject.ts` | Default `ResearchProject` + mock users |
| `src/data/mockInstitution.ts` | `InstitutionData` for admin dashboard |
| `src/data/mockSupervisor.ts` | Supervised students data |
| `src/data/sectionTemplates.ts` | All 9 project type templates |

---

## 12. Backend (Lovable Cloud)

### 12.1 Edge Functions

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `ai-chat` | `POST /ai-chat` | Streaming AI chat with project context injection |

### 12.2 Database

Currently empty schema — no tables created yet. All data is client-side mock.

### 12.3 Migration Priorities for Production

1. **Users & Profiles** — `profiles` table linked to auth.users
2. **Projects** — `projects` table with RLS per user
3. **Sections** — `sections` table (FK to projects)
4. **References** — `references` table (FK to projects)
5. **Datasets** — Storage bucket + `datasets` metadata table
6. **Institutions** — `institutions`, `faculties`, `departments` tables
7. **Supervision** — `supervisor_students` junction table
8. **Collaboration** — `project_collaborators` junction table
9. **Exports** — `export_history` table
10. **Analytics** — `activity_log` table

---

## 13. Export System

### 13.1 Supported Formats

| Format | Implementation |
|--------|---------------|
| DOCX | Simulated (mock download) |
| PDF | Simulated (mock download) |
| LaTeX | Simulated (mock download) |

### 13.2 Configuration Options

- **Citation Style:** APA 7th, IEEE, Chicago, Harvard, Vancouver, MLA
- **Cover Page:** Toggle
- **Table of Contents:** Toggle
- **Embedded Figures:** Toggle

### 13.3 Export Flow

1. User selects format + citation style + options
2. Simulated progress bar (2-3 seconds)
3. Export record added to `project.exports[]`
4. Download link displayed

---

## 14. Key Engineering Decisions & Trade-offs

| Decision | Rationale | Risk |
|----------|-----------|------|
| Mock data everywhere | Rapid prototyping, no backend dependency | Must be replaced for production |
| Single ProjectContext | Simple state for prototype | Won't scale — needs per-project DB queries |
| Role in AuthContext only | No DB enforcement | Insecure — needs RLS policies per role |
| No real auth | Demo-friendly | Must implement Supabase Auth |
| AI via edge function | Centralized, secure key management | Single point of failure |
| Section templates as code | Easy to iterate | Should become DB-driven for custom templates |

---

## 15. File Tree Summary

```
src/
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
├── context/
│   ├── AuthContext.tsx         # Authentication state
│   ├── ProjectContext.tsx      # Research project state
│   └── InstitutionContext.tsx  # Institution state
├── data/
│   ├── mockProject.ts
│   ├── mockInstitution.ts
│   ├── mockSupervisor.ts
│   └── sectionTemplates.ts    # 433 lines, 9 templates
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── integrations/supabase/     # Auto-generated (DO NOT EDIT)
├── pages/
│   ├── Landing.tsx
│   ├── Auth.tsx
│   ├── Onboarding.tsx
│   ├── SupervisorOnboarding.tsx
│   ├── AdminOnboarding.tsx
│   ├── NotFound.tsx
│   ├── app/                   # 11 researcher pages
│   ├── admin/                 # 6 admin pages
│   └── supervisor/            # 4 supervisor pages
├── types/
│   └── research.ts            # 238 lines, all type definitions
└── lib/utils.ts
supabase/
├── config.toml
└── functions/ai-chat/index.ts
```

---

*End of Architecture Document*
