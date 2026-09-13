/**
 * API contract types — mirrors openapi.yaml at the repo root.
 * The real backend (FastAPI) will implement these exact shapes.
 */

export type Urgency = "critical" | "soon" | "later";

export interface Team {
  id: string;
  name: string;
  league: string;
  crestUrl: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue: string;
  /** ISO-8601 kickoff timestamp (UTC) */
  kickoffAt: string;
  crestUrl: string;
  urgency: Urgency;
  betPlaced: boolean;
}

export type ReminderInterval = "5d" | "2d" | "2h";

export interface SubscriptionPayload {
  teamIds: string[];
  reminderIntervals: ReminderInterval[];
}

export interface Subscription extends SubscriptionPayload {
  id: string;
  telegramHandle: string | null;
  updatedAt: string;
}
