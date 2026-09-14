import { useEffect, useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import type { Match, Urgency } from "@/lib/api/types";

const accent: Record<Urgency, string> = {
  critical: "border-l-critical",
  soon: "border-l-soon",
  later: "border-l-later",
};

const countdownColor: Record<Urgency, string> = {
  critical: "text-critical",
  soon: "text-soon",
  later: "text-later",
};

function useKickoffLabel(iso: string) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const d = new Date(iso);
    const today = new Date();
    const dayDiff = Math.round(
      (new Date(d.toDateString()).getTime() - new Date(today.toDateString()).getTime()) / 86400000,
    );
    const day =
      dayDiff === 0
        ? "Today"
        : dayDiff === 1
          ? "Tomorrow"
          : d.toLocaleDateString("en-GB", { weekday: "short" });
    const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setLabel(`${day} · ${time}`);
  }, [iso]);
  return label;
}

export function MatchRow({
  match,
  onBetPlaced,
  pending,
  last,
}: {
  match: Match;
  onBetPlaced: (id: string) => void;
  pending: boolean;
  last?: boolean;
}) {
  const countdown = useCountdown(match.kickoffAt);
  const kickoff = useKickoffLabel(match.kickoffAt);

  return (
    <div
      className={`grid grid-cols-[1fr_auto] sm:grid-cols-[1.4fr_1fr_auto] gap-3 items-center px-4 sm:px-5 py-4 border-l-[3px] transition duration-300 ${
        last ? "" : "border-b border-line/60"
      } ${match.betPlaced ? "border-l-line opacity-45" : accent[match.urgency]} ${
        match.urgency === "critical" && !match.betPlaced ? "pulse-critical" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={match.crestUrl}
          alt=""
          loading="lazy"
          width={512}
          height={512}
          className="size-10 shrink-0 rounded-md bg-panel2 object-contain p-1"
        />
        <div className="min-w-0">
          <p
            className={`font-display font-semibold text-base leading-tight truncate ${
              match.betPlaced ? "line-through decoration-dim" : ""
            }`}
          >
            {match.homeTeam} vs {match.awayTeam}
          </p>
          <p className="text-[12px] text-dim truncate">
            {kickoff ? `${kickoff} · ${match.venue}` : match.venue}
          </p>
        </div>
      </div>

      <span className="hidden sm:block text-[12px] text-dim">{match.competition}</span>

      <div className="flex items-center gap-3 justify-end">
        <span
          className={`font-display font-bold text-2xl sm:text-3xl tabular-nums leading-none ${
            match.betPlaced ? "text-dim" : countdownColor[match.urgency]
          }`}
        >
          {countdown}
        </span>
        <button
          onClick={() => onBetPlaced(match.id)}
          disabled={pending}
          className={`shrink-0 h-9 px-3 rounded-md text-[12px] font-display font-semibold ring-1 transition duration-150 disabled:opacity-50 ${
            match.betPlaced
              ? "bg-good/15 text-good ring-good/40 hover:bg-good/25"
              : match.urgency === "critical"
                ? "bg-critical text-white ring-critical/50 hover:bg-critical/90"
                : "bg-panel2 text-ink ring-line hover:bg-line/50"
          }`}
        >
          {match.betPlaced ? "Snoozed" : "Bet Placed"}
        </button>
      </div>
    </div>
  );
}
