import { AppRole } from "@/types/research";

/**
 * Centralized RBAC permission catalog.
 * Each permission is a stable string used across UI and (future) API calls.
 */
export type Permission =
  // Project lifecycle
  | "project.create"
  | "project.edit"
  | "project.delete"
  | "project.submit"
  | "project.export"
  | "project.view.own"
  | "project.view.department"
  | "project.view.faculty"
  | "project.view.institution"
  // Review & approval
  | "review.comment"
  | "review.approve.section"
  | "review.approve.final"
  | "review.examine.external"
  // Supervision
  | "supervision.assign"
  // Compliance & audit
  | "compliance.threshold.set"
  | "compliance.policy.set"
  | "audit.view.department"
  | "audit.view.institution"
  // AI policy
  | "ai.policy.set"
  | "ai.use.rewrite"
  | "ai.use.generate"
  // Users & institution
  | "users.invite"
  | "users.manage.department"
  | "users.manage.faculty"
  | "users.manage.institution"
  | "institution.configure"
  | "institution.theming"
  // Analytics
  | "analytics.view.department"
  | "analytics.view.faculty"
  | "analytics.view.institution"
  | "analytics.view.executive";

const STUDENT: Permission[] = [
  "project.create", "project.edit", "project.submit", "project.export",
  "project.view.own", "ai.use.rewrite",
];

const SUPERVISOR: Permission[] = [
  ...STUDENT,
  "supervision.assign", "review.comment", "review.approve.section",
  "project.view.department", "ai.use.generate",
];

const HOD: Permission[] = [
  ...SUPERVISOR,
  "review.approve.final", "users.manage.department",
  "compliance.threshold.set", "audit.view.department",
  "analytics.view.department",
];

const PG_COORDINATOR: Permission[] = [
  "project.view.department", "project.view.faculty",
  "review.comment", "review.approve.section",
  "supervision.assign", "users.manage.department",
  "analytics.view.department", "analytics.view.faculty",
];

const DEAN: Permission[] = [
  "project.view.faculty", "users.manage.faculty",
  "review.approve.final", "audit.view.department",
  "analytics.view.faculty", "compliance.policy.set",
];

const DIRECTOR_OF_RESEARCH: Permission[] = [
  "project.view.institution", "audit.view.institution",
  "analytics.view.institution", "analytics.view.executive",
  "compliance.policy.set", "ai.policy.set", "users.manage.institution",
];

const VC: Permission[] = [
  "project.view.institution", "analytics.view.institution",
  "analytics.view.executive", "audit.view.institution",
  "compliance.policy.set", "compliance.threshold.set",
  "institution.configure", "institution.theming",
  "users.manage.institution", "users.invite",
];

const EXTERNAL_EXAMINER: Permission[] = [
  "project.view.own", "review.examine.external", "review.comment",
];

const INTERNAL_EXAMINER: Permission[] = [
  "project.view.department", "review.examine.external", "review.comment",
];

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  "Undergraduate Student": STUDENT,
  "Master's Student": STUDENT,
  "PhD Student": STUDENT,
  "Researcher": [...STUDENT, "ai.use.generate"],
  "Supervisor": SUPERVISOR,
  "Head of Department": HOD,
  "PG Coordinator": PG_COORDINATOR,
  "Dean": DEAN,
  "Director of Research": DIRECTOR_OF_RESEARCH,
  "Vice Chancellor": VC,
  "External Examiner": EXTERNAL_EXAMINER,
  "Internal Examiner": INTERNAL_EXAMINER,
};

export function hasPermission(role: AppRole | undefined | null, perm: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(perm) ?? false;
}

export function hasAnyPermission(role: AppRole | undefined | null, perms: Permission[]): boolean {
  return perms.some((p) => hasPermission(role, p));
}

/** Default landing route per role — used by Auth + RoleRouter. */
export const ROLE_HOME_ROUTE: Record<AppRole, string> = {
  "Undergraduate Student": "/app/proj-001/dashboard",
  "Master's Student": "/app/proj-001/dashboard",
  "PhD Student": "/app/proj-001/dashboard",
  "Researcher": "/app/proj-001/dashboard",
  "Supervisor": "/supervisor/overview",
  "Head of Department": "/hod/overview",
  "PG Coordinator": "/pg-coordinator/overview",
  "Dean": "/dean/overview",
  "Director of Research": "/admin/dashboard",
  "Vice Chancellor": "/vc/overview",
  "External Examiner": "/examiner/queue",
  "Internal Examiner": "/examiner/queue",
};
