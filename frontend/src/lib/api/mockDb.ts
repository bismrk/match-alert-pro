import crestNavy from "@/assets/crest-navy.png";
import crestRed from "@/assets/crest-red.png";
import crestGreen from "@/assets/crest-green.png";
import crestBlack from "@/assets/crest-black.png";
import type { Match, Subscription, Team } from "./types";

const hoursFromNow = (h: number) => new Date(Date.now() + h * 3600_000).toISOString();

export const teams: Team[] = [
  { id: "rma", name: "Real Madrid", league: "La Liga", crestUrl: crestNavy },
  { id: "bar", name: "Barcelona", league: "La Liga", crestUrl: crestGreen },
  { id: "ars", name: "Arsenal", league: "Premier League", crestUrl: crestRed },
  { id: "liv", name: "Liverpool", league: "Premier League", crestUrl: crestRed },
  { id: "int", name: "Inter", league: "Serie A", crestUrl: crestGreen },
  { id: "juv", name: "Juventus", league: "Serie A", crestUrl: crestBlack },
  { id: "mil", name: "AC Milan", league: "Serie A", crestUrl: crestRed },
  { id: "bay", name: "Bayern", league: "Bundesliga", crestUrl: crestNavy },
  { id: "bvb", name: "Dortmund", league: "Bundesliga", crestUrl: crestBlack },
  { id: "psg", name: "PSG", league: "Ligue 1", crestUrl: crestNavy },
];

export const matches: Match[] = [
  {
    id: "m1",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    competition: "La Liga",
    venue: "Estadio Bernabéu",
    kickoffAt: hoursFromNow(1.4),
    crestUrl: crestNavy,
    urgency: "critical",
    betPlaced: false,
  },
  {
    id: "m2",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    competition: "Premier League",
    venue: "Emirates",
    kickoffAt: hoursFromNow(18),
    crestUrl: crestRed,
    urgency: "soon",
    betPlaced: false,
  },
  {
    id: "m3",
    homeTeam: "Inter",
    awayTeam: "Juventus",
    competition: "Serie A",
    venue: "San Siro",
    kickoffAt: hoursFromNow(30.4),
    crestUrl: crestGreen,
    urgency: "soon",
    betPlaced: false,
  },
  {
    id: "m4",
    homeTeam: "Bayern",
    awayTeam: "Dortmund",
    competition: "Bundesliga",
    venue: "Allianz",
    kickoffAt: hoursFromNow(60.2),
    crestUrl: crestBlack,
    urgency: "later",
    betPlaced: false,
  },
];

export const subscription: Subscription = {
  id: "sub_mock_user",
  teamIds: ["rma", "ars", "int", "bay"],
  reminderIntervals: ["5d", "2d", "2h"],
  telegramHandle: "@bet_tracker",
  updatedAt: new Date().toISOString(),
};
