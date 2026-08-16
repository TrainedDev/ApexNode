import { CheckCircle2 } from 'lucide-react'

export default function SuccessBanner({ message = 'Profile fetched successfully.', className = '' }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700 shadow-sm animate-fade-in ${className}`}
      role="status"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" strokeWidth={2.25} />
      </span>
      {message}
    </div>
  )
}
