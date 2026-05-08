/**
 * Lightweight event bus — foundation for the future event-driven
 * notification & audit pipeline. Currently in-memory; will be replaced
 * by edge-function-backed pub/sub once Cloud is wired up.
 */
export type DomainEvent =
  | { type: "project.created"; projectId: string; actorId: string; payload?: Record<string, unknown> }
  | { type: "project.section.approved"; projectId: string; sectionId: string; actorId: string }
  | { type: "project.submitted"; projectId: string; actorId: string }
  | { type: "review.requested"; projectId: string; reviewerId: string; actorId: string }
  | { type: "ethics.requested"; projectId: string; actorId: string }
  | { type: "ai.policy.changed"; actorId: string; payload?: Record<string, unknown> }
  | { type: "user.invited"; email: string; role: string; actorId: string }
  | { type: "audit.note"; actorId: string; message: string };

type Listener = (e: DomainEvent) => void;

const listeners = new Set<Listener>();

export const eventBus = {
  publish(event: DomainEvent) {
    listeners.forEach((l) => {
      try { l(event); } catch (err) { console.error("eventBus listener error", err); }
    });
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
