/**
 * Real API client connected to the FastAPI backend.
 */
import type { Match, Subscription, SubscriptionPayload, Team } from "./types";

const API_BASE = "http://127.0.0.1:8000/api";
let cachedToken: string | null = null;

async function getToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  
  const res = await fetch(`${API_BASE}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: "testuser",
      password: "password",
    }),
  });
  
  if (!res.ok) {
    throw new Error("Failed to authenticate with backend");
  }
  
  const data = await res.json();
  cachedToken = data.access_token;
  return cachedToken;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = await getToken();
  
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && options.method !== "GET" && options.method !== "DELETE") {
    headers.set("Content-Type", "application/json");
  }
  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!res.ok) {
    throw new Error(`API request failed: ${res.statusText}`);
  }
  
  return res.json();
}

/** GET /api/teams */
export async function getTeams(): Promise<Team[]> {
  // Can be accessed without auth, but we'll use our wrapper for simplicity
  return fetchWithAuth("/teams");
}

/** GET /api/matches/urgency */
export async function getMatchesByUrgency(): Promise<Match[]> {
  return fetchWithAuth("/matches/urgency");
}

/** POST /api/subscriptions */
export async function saveSubscription(payload: SubscriptionPayload): Promise<Subscription> {
  return fetchWithAuth("/subscriptions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /api/subscriptions */
export async function getSubscription(): Promise<Subscription> {
  return fetchWithAuth("/subscriptions");
}

/** POST /api/matches/{id}/bet-placed */
export async function markBetPlaced(id: string): Promise<Match> {
  return fetchWithAuth(`/matches/${id}/bet-placed`, {
    method: "POST",
  });
}
