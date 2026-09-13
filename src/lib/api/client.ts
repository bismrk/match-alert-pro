/**
 * Mocked API client.
 *
 * Every function here maps 1:1 to an endpoint in openapi.yaml. Swap the bodies
 * for real `fetch` calls once the FastAPI backend is running — signatures stay.
 */
import { matches, subscription, teams } from "./mockDb";
import type { Match, Subscription, SubscriptionPayload, Team } from "./types";

const latency = (ms = 220) => new Promise((r) => setTimeout(r, ms));

/** GET /api/teams */
export async function getTeams(): Promise<Team[]> {
  await latency();
  return structuredClone(teams);
}

/** GET /api/matches/urgency */
export async function getMatchesByUrgency(): Promise<Match[]> {
  await latency();
  return structuredClone(matches).sort(
    (a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime(),
  );
}

/** POST /api/subscriptions */
export async function saveSubscription(payload: SubscriptionPayload): Promise<Subscription> {
  await latency(300);
  subscription.teamIds = payload.teamIds;
  subscription.reminderIntervals = payload.reminderIntervals;
  subscription.updatedAt = new Date().toISOString();
  return structuredClone(subscription);
}

/** GET /api/subscriptions */
export async function getSubscription(): Promise<Subscription> {
  await latency();
  return structuredClone(subscription);
}

/** POST /api/matches/{id}/bet-placed */
export async function markBetPlaced(id: string): Promise<Match> {
  await latency(200);
  const match = matches.find((m) => m.id === id);
  if (!match) throw new Error(`Match ${id} not found`);
  match.betPlaced = !match.betPlaced;
  return structuredClone(match);
}
