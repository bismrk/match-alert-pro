import { useMemo, useState } from "react";
import type { Team } from "@/lib/api/types";

export function TeamSubscriptions({
  teams,
  selected,
  onToggle,
}: {
  teams: Team[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  const followed = useMemo(
    () => teams.filter((t) => selected.includes(t.id)),
    [teams, selected],
  );
  const available = useMemo(
    () =>
      teams.filter(
        (t) =>
          !selected.includes(t.id) && t.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [teams, selected, query],
  );

  return (
    <section className="rounded-lg bg-panel ring-1 ring-line p-5 space-y-4">
      <div>
        <p className="text-[11px] tracking-[0.2em] text-dim uppercase">Subscriptions</p>
        <h2 className="font-display font-semibold text-2xl leading-tight tracking-tight mt-1">
          Teams you track
        </h2>
      </div>

      <div className="flex items-center gap-2 h-10 rounded-md bg-panel2 ring-1 ring-line px-3">
        <span className="text-dim text-sm">⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search top-tier clubs…"
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-dim outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {followed.map((team) => (
          <button
            key={team.id}
            onClick={() => onToggle(team.id)}
            className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-md bg-critical/15 ring-1 ring-critical/40 text-[12px] font-medium text-ink transition duration-150 hover:bg-critical/25"
          >
            <i className="size-1.5 rounded-full bg-critical" />
            {team.name}
            <i className="text-dim not-italic">×</i>
          </button>
        ))}
        {followed.length === 0 && (
          <span className="text-[12px] text-dim">No clubs followed yet.</span>
        )}
      </div>

      <div className="border-t border-line/60 pt-3 space-y-1.5 text-[12px]">
        {available.slice(0, 5).map((team) => (
          <button
            key={team.id}
            onClick={() => onToggle(team.id)}
            className="flex w-full justify-between transition duration-150 hover:text-ink"
          >
            <span className="text-dim">{team.name}</span>
            <span className="text-later">{team.league}</span>
          </button>
        ))}
        {available.length === 0 && <p className="text-dim">No more clubs match.</p>}
      </div>
    </section>
  );
}
