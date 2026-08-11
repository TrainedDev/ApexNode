const FILTERS = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "complete", label: "Completed" },
  { key: "failed", label: "Failed" },
  { key: "canceled", label: "Canceled" },
];

export default function OrderFilter({ activeFilter, onChange, counts }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
      {FILTERS.map(({ key, label }) => {
        const isActive = activeFilter === key;
        const count = counts?.[key] ?? 0;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={isActive}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors
              ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
              }`}
          >
            {label}
            {typeof count === "number" && (
              <span
                className={`text-xs rounded-full px-1.5 leading-5 ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
