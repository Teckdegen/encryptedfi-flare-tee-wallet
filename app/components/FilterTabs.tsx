"use client";
export type Filter = "all" | "public" | "private";

export function FilterTabs({ current, onChange }: { current: Filter; onChange: (f: Filter) => void }) {
  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "ALL" },
    { id: "public", label: "PUBLIC" },
    { id: "private", label: "PRIVATE" },
  ];
  return (
    <div className="glass rounded-full p-1 grid grid-cols-3 mb-4">
      {tabs.map((t) => {
        const active = current === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`py-2.5 text-xs font-bold tracking-widest rounded-full transition ${
              active ? "bg-white/10 text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
