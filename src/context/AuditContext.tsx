import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { eventBus, DomainEvent } from "@/lib/eventBus";
import { useAuth } from "./AuthContext";

export interface AuditEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  type: string;
  message: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

interface AuditContextType {
  entries: AuditEntry[];
  log: (type: string, message: string, meta?: Record<string, unknown>) => void;
  clear: () => void;
}

const AuditContext = createContext<AuditContextType | null>(null);

const SEED: AuditEntry[] = [
  { id: "a1", actorId: "hod-001", actorName: "Prof. Adaeze Okonkwo", actorRole: "Head of Department", type: "compliance.threshold.set", message: "Updated minimum integrity threshold to 70", timestamp: "2026-04-21T09:14:00Z" },
  { id: "a2", actorId: "dor-001", actorName: "Prof. Tunde Bakare", actorRole: "Director of Research", type: "ai.policy.changed", message: "Disabled full AI generation institution-wide", timestamp: "2026-04-19T16:02:00Z" },
  { id: "a3", actorId: "sup-001", actorName: "Prof. Kwame Mwangi", actorRole: "Supervisor", type: "review.approve.section", message: "Approved Methodology section for proj-001", timestamp: "2026-04-18T11:40:00Z" },
];

export const AuditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role } = useAuth();
  const [entries, setEntries] = useState<AuditEntry[]>(SEED);

  const log = useCallback((type: string, message: string, meta?: Record<string, unknown>) => {
    setEntries((prev) => [{
      id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      actorId: user?.id ?? "system",
      actorName: user?.name ?? "System",
      actorRole: role ?? "System",
      type, message, meta,
      timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 500));
  }, [user, role]);

  useEffect(() => {
    return eventBus.subscribe((e: DomainEvent) => {
      log(e.type, formatEvent(e), (e as any).payload);
    });
  }, [log]);

  const clear = useCallback(() => setEntries([]), []);

  return (
    <AuditContext.Provider value={{ entries, log, clear }}>{children}</AuditContext.Provider>
  );
};

function formatEvent(e: DomainEvent): string {
  switch (e.type) {
    case "project.created": return `Created project ${e.projectId}`;
    case "project.section.approved": return `Approved section ${e.sectionId} on ${e.projectId}`;
    case "project.submitted": return `Submitted project ${e.projectId}`;
    case "review.requested": return `Requested review for ${e.projectId}`;
    case "ethics.requested": return `Requested ethics review for ${e.projectId}`;
    case "ai.policy.changed": return `Updated AI policy`;
    case "user.invited": return `Invited ${e.email} as ${e.role}`;
    case "audit.note": return e.message;
  }
}

export const useAudit = () => {
  const ctx = useContext(AuditContext);
  if (!ctx) return { entries: [], log: () => {}, clear: () => {} } as AuditContextType;
  return ctx;
};
