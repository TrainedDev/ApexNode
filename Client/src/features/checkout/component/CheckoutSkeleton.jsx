function Block({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
}

export default function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Block className="mb-8 h-8 w-40" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Address skeleton */}
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <Block className="h-5 w-40" />
              <Block className="h-8 w-28 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Block className="h-4 w-56" />
              <Block className="h-4 w-72" />
              <Block className="h-4 w-64" />
              <Block className="h-4 w-48" />
            </div>
          </div>

          {/* Products skeleton */}
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <Block className="mb-4 h-5 w-32" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0">
                  <Block className="h-20 w-20 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Block className="h-4 w-40" />
                    <Block className="h-3 w-24" />
                    <Block className="h-3 w-32" />
                  </div>
                  <div className="space-y-2">
                    <Block className="h-3 w-20" />
                    <Block className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment skeleton */}
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <Block className="mb-4 h-5 w-36" />
            <Block className="h-16 w-full rounded-xl" />
          </div>
        </div>

        {/* Right column */}
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <Block className="mb-5 h-5 w-32" />
          <div className="space-y-3">
            <Block className="h-4 w-full" />
            <Block className="h-4 w-full" />
            <Block className="h-4 w-2/3" />
          </div>
          <div className="my-5 h-px bg-slate-100" />
          <Block className="mb-6 h-6 w-full" />
          <Block className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
