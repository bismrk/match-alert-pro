import type { ReminderInterval } from "@/lib/api/types";

const ROWS: { id: ReminderInterval; when: string; label: string }[] = [
  { id: "5d", when: "5 days out", label: "Reminder" },
  { id: "2d", when: "2 days out", label: "Reminder" },
  { id: "2h", when: "2 hours out", label: "Critical ping" },
];

export function ReminderSettings({
  intervals,
  telegramHandle,
  onToggle,
}: {
  intervals: ReminderInterval[];
  telegramHandle: string | null;
  onToggle: (id: ReminderInterval) => void;
}) {
  return (
    <section className="rounded-lg bg-panel ring-1 ring-line p-5 space-y-4">
      <div>
        <p className="text-[11px] tracking-[0.2em] text-dim uppercase">Reminders</p>
        <h2 className="font-display font-semibold text-2xl leading-tight tracking-tight mt-1">
          Alert cadence
        </h2>
      </div>

      <div className="space-y-2">
        {ROWS.map((row) => {
          const on = intervals.includes(row.id);
          return (
            <button
              key={row.id}
              onClick={() => onToggle(row.id)}
              className="flex w-full items-center gap-4 h-11 px-4 rounded-md bg-panel2 ring-1 ring-line transition duration-150 hover:ring-line/80"
            >
              <span className="text-[12px] text-dim w-24 text-left">{row.when}</span>
              <span className="flex-1 font-display font-semibold text-ink text-sm text-left">
                {row.label}
              </span>
              <span
                className={`relative inline-flex h-6 w-11 items-center rounded-full ring-1 transition duration-200 ${
                  on ? "bg-good/30 ring-good/50" : "bg-line/60 ring-line"
                }`}
              >
                <span
                  className={`absolute size-4 rounded-full transition-all duration-200 ${
                    on ? "right-0.5 bg-good" : "left-0.5 bg-dim"
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 h-11 px-4 rounded-md bg-panel2 ring-1 ring-line border-l-2 border-l-good">
        <span className="size-2 rounded-full bg-good" />
        <span className="text-sm text-ink">Telegram connected</span>
        <span className="ml-auto text-[11px] text-dim">{telegramHandle ?? "not linked"}</span>
      </div>

      <p className="text-[11px] text-dim text-pretty">
        Betting a match here stops all in-app and Telegram pings for that fixture until kickoff.
      </p>
    </section>
  );
}
