function Block({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
}

export default function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Block className="mb-8 h-8 w-44" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left card skeleton */}
        <div className="rounded-2xl bg-white p-8 shadow-card">
          <div className="flex flex-col items-center text-center">
            <Block className="mb-5 h-24 w-24 rounded-full" />
            <Block className="mb-2 h-5 w-36" />
            <Block className="mb-4 h-4 w-28" />
            <Block className="mb-6 h-4 w-24" />
            <Block className="h-7 w-32 rounded-full" />
          </div>
        </div>

        {/* Right form skeleton */}
        <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
          <Block className="mb-6 h-5 w-44" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={i === 2 ? 'space-y-2 sm:col-span-2' : 'space-y-2'}>
                <Block className="h-3.5 w-24" />
                <Block className="h-11 w-full rounded-xl" />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Block className="h-12 w-full rounded-xl sm:w-44" />
          </div>
        </div>
      </div>
    </div>
  )
}
