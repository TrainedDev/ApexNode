export default function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-slate-100 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
        </div>
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex -space-x-3">
          <div className="h-12 w-12 rounded-lg bg-slate-100 ring-2 ring-white" />
          <div className="h-12 w-12 rounded-lg bg-slate-100 ring-2 ring-white" />
        </div>
        <div className="h-3 w-24 bg-slate-100 rounded" />
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-slate-100 rounded" />
          <div className="h-5 w-24 bg-slate-200 rounded" />
        </div>
        <div className="h-9 w-28 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}
