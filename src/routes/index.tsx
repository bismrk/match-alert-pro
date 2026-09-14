import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MatchRow } from "@/components/MatchRow";
import { ReminderSettings } from "@/components/ReminderSettings";
import { TeamSubscriptions } from "@/components/TeamSubscriptions";
import { useLocalClock } from "@/hooks/useCountdown";
import {
  getMatchesByUrgency,
  getSubscription,
  getTeams,
  markBetPlaced,
  saveSubscription,
} from "@/lib/api/client";
import type { Match, ReminderInterval } from "@/lib/api/types";

const TITLE = "MatchTracker Pro — Betting Countdown Scoreboard";
const DESCRIPTION =
  "Follow only your top-tier clubs, get Telegram reminders 5 days, 2 days and 2 hours before kickoff, and snooze alerts once your bet is placed.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const FORTY_EIGHT_HOURS = 48 * 3600_000;

function Dashboard() {
  const queryClient = useQueryClient();
  const clock = useLocalClock();

  const matches = useQuery({ queryKey: ["matches", "urgency"], queryFn: getMatchesByUrgency });
  const teams = useQuery({ queryKey: ["teams"], queryFn: getTeams });
  const subscription = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });

  const betMutation = useMutation({
    mutationFn: markBetPlaced,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["matches", "urgency"] }),
  });

  const subMutation = useMutation({
    mutationFn: saveSubscription,
    onSuccess: (data) => queryClient.setQueryData(["subscription"], data),
  });

  const list: Match[] = matches.data ?? [];
  const counts = {
    critical: list.filter((m) => m.urgency === "critical").length,
    soon: list.filter((m) => m.urgency === "soon").length,
    later: list.filter((m) => m.urgency === "later").length,
  };

  const nearIndex = list.findIndex(
    (m) => new Date(m.kickoffAt).getTime() - Date.now() > FORTY_EIGHT_HOURS,
  );
  const nearCount = nearIndex === -1 ? list.length : nearIndex;
  const farCount = list.length - nearCount;

  const teamIds = subscription.data?.teamIds ?? [];
  const intervals = subscription.data?.reminderIntervals ?? [];

  const toggleTeam = (id: string) =>
    subMutation.mutate({
      teamIds: teamIds.includes(id) ? teamIds.filter((t) => t !== id) : [...teamIds, id],
      reminderIntervals: intervals,
    });

  const toggleInterval = (id: ReminderInterval) =>
    subMutation.mutate({
      teamIds,
      reminderIntervals: intervals.includes(id)
        ? intervals.filter((i) => i !== id)
        : [...intervals, id],
    });

  return (
    <div className="min-h-screen bg-surface text-ink selection:bg-critical/30 selection:text-white">
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-critical" />
        <div className="flex-1 bg-soon" />
        <div className="flex-1 bg-later" />
        <div className="flex-1 bg-good/40" />
      </div>

      <header className="border-b border-line/70">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 grid place-items-center rounded-md bg-critical text-white font-display font-bold text-lg">
              M
            </div>
            <div className="leading-none">
              <p className="font-display font-extrabold text-lg tracking-tight">MatchTracker Pro</p>
              <p className="text-[11px] text-dim tracking-wide mt-0.5">
                betting scoreboard · night shift
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-md bg-panel ring-1 ring-line text-[12px] text-dim">
              <span className="size-2 rounded-full bg-good animate-pulse" />
              Telegram linked
            </div>
            <div className="text-right leading-none">
              <p className="text-[10px] text-dim tracking-widest">LOCAL</p>
              <p className="font-display font-semibold text-base tabular-nums mt-0.5">
                {clock || "--:--:--"}
              </p>
            </div>
            <div className="size-9 grid place-items-center rounded-md bg-panel2 ring-1 ring-line text-dim text-[11px] font-medium">
              RB
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-8 space-y-8">
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] tracking-[0.2em] text-dim uppercase">Urgency Dashboard</p>
              <h1 className="font-display font-bold text-4xl sm:text-5xl leading-none tracking-tight mt-1 text-balance">
                Next to close
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2.5 h-7 grid place-items-center rounded-md bg-panel ring-1 ring-line text-critical">
                ● {counts.critical} critical
              </span>
              <span className="px-2.5 h-7 grid place-items-center rounded-md bg-panel ring-1 ring-line text-soon">
                ● {counts.soon} soon
              </span>
              <span className="px-2.5 h-7 grid place-items-center rounded-md bg-panel ring-1 ring-line text-later">
                ● {counts.later} later
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-panel ring-1 ring-line overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.4fr_1fr_auto] gap-3 px-4 sm:px-5 py-2.5 border-b border-line/60 text-[10px] tracking-[0.18em] text-dim uppercase">
              <span>Fixture</span>
              <span className="hidden sm:block">Competition</span>
              <span className="text-right">Countdown</span>
            </div>

            {matches.isLoading && (
              <p className="px-5 py-8 text-[12px] text-dim">Loading fixtures…</p>
            )}

            {list.map((match, i) => (
              <div key={match.id}>
                {i === nearCount && farCount > 0 && (
                  <div className="flex items-center gap-2 px-4 sm:px-5 py-2 border-b border-line/60">
                    <span className="text-[9px] tracking-[0.25em] text-dim uppercase">
                      Within 48h · {nearCount} fixtures
                    </span>
                    <span className="flex-1 h-px bg-line/60" />
                    <span className="text-[9px] tracking-[0.25em] text-dim uppercase">
                      Beyond 48h · {farCount} fixtures
                    </span>
                  </div>
                )}
                <MatchRow
                  match={match}
                  onBetPlaced={(id) => betMutation.mutate(id)}
                  pending={betMutation.isPending && betMutation.variables === match.id}
                  last={i === list.length - 1}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-6">
          <TeamSubscriptions
            teams={teams.data ?? []}
            selected={teamIds}
            onToggle={toggleTeam}
          />
          <ReminderSettings
            intervals={intervals}
            telegramHandle={subscription.data?.telegramHandle ?? null}
            onToggle={toggleInterval}
          />
        </div>
      </main>
    </div>
  );
}
