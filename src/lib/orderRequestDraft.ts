const DRAFT_KEY = "p1p-order-request-draft";

export type OrderRequestDraft = {
  needByDate?: string;
  deliverySpeed?: string;
  specialInstructions?: string;
  source?: "quote" | "manual";
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readOrderRequestDraft(): OrderRequestDraft | null {
  if (!canUseStorage()) return null;
  try {
    // Prefer localStorage (survives navigation); migrate any session draft.
    const local = window.localStorage.getItem(DRAFT_KEY);
    const session = window.sessionStorage.getItem(DRAFT_KEY);
    const raw = local || session;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OrderRequestDraft;
    if (!parsed || typeof parsed !== "object") return null;
    if (!local && session) {
      window.localStorage.setItem(DRAFT_KEY, session);
      window.sessionStorage.removeItem(DRAFT_KEY);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeOrderRequestDraft(draft: OrderRequestDraft) {
  if (!canUseStorage()) return;
  const prev = readOrderRequestDraft() || {};
  const next: OrderRequestDraft = {
    ...prev,
    ...draft,
  };
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  window.sessionStorage.removeItem(DRAFT_KEY);
  window.dispatchEvent(new CustomEvent("p1p-order-draft-change"));
}

export function clearOrderRequestDraft() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(DRAFT_KEY);
  window.sessionStorage.removeItem(DRAFT_KEY);
  window.dispatchEvent(new CustomEvent("p1p-order-draft-change"));
}

/** Calendar days from today (local) to a YYYY-MM-DD need-by date. */
export function daysUntilNeedBy(needByDate: string): number | null {
  if (!needByDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${needByDate}T12:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export type AutoTimeline = {
  id: "rush" | "standard" | "flexible";
  label: string;
  hint: string;
};

export function timelineFromNeedBy(needByDate: string): AutoTimeline | null {
  const days = daysUntilNeedBy(needByDate);
  if (days === null || days < 1) return null;
  if (days <= 7) {
    return {
      id: "rush",
      label: "Rush",
      hint: "About 5–7 days — faster when the calendar allows",
    };
  }
  if (days <= 14) {
    return {
      id: "standard",
      label: "Standard",
      hint: "About 10–14 days — typical production window",
    };
  }
  return {
    id: "flexible",
    label: "Flexible",
    hint: "More than two weeks — room to plan production",
  };
}

export function minNeedByDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
