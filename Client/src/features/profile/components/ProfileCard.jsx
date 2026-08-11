import { Phone, MapPin, BadgeCheck } from 'lucide-react'

export default function ProfileCard({
  fullName = 'Aarav Sharma',
  phone = '+91 98765 43210',
  city = 'Bengaluru',
  country = 'India',
  isVerified = true,
}) {
  const initial = fullName?.trim()?.charAt(0)?.toUpperCase() || '?'

  return (
    <section className="rounded-2xl bg-white p-8 text-center shadow-card transition-shadow hover:shadow-card-hover">
      {/* Avatar */}
      <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 via-brand-50 to-white ring-4 ring-brand-50">
        <span className="text-3xl font-bold text-brand-600">{initial}</span>
      </div>

      {/* Name */}
      <h2 className="text-lg font-semibold text-slate-900">{fullName}</h2>

      {/* Details */}
      <div className="mt-3 space-y-2 text-sm text-slate-500">
        <div className="flex items-center justify-center gap-1.5">
          <Phone className="h-3.5 w-3.5 text-slate-400" />
          {phone}
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          {city}, {country}
        </div>
      </div>

      {/* Verified badge */}
      {isVerified && (
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700">
          <BadgeCheck className="h-3.5 w-3.5" />
          Verified Customer
        </span>
      )}
    </section>
  )
}
