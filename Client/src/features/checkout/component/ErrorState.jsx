import { AlertTriangle } from 'lucide-react'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md animate-scale-in rounded-2xl bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-7 w-7 text-red-500" strokeWidth={2} />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Unable to load checkout</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {message || "We couldn't load your checkout details. Please check your connection and try again."}
        </p>
        <button
          onClick={onRetry}
          className="mt-6 w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 active:scale-[0.98]"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
