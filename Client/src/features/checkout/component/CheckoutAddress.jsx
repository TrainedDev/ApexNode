import { MapPin, ChevronRight, User, Phone } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProfile } from '../../profile/profileSlice';
import { useEffect } from 'react';

export default function CheckoutAddress({ onChangeAddress, onAddAddress, data }) {


  if (!data) {
    return (
      <section className="rounded-2xl bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <MapPin className="h-7 w-7 text-slate-400" strokeWidth={2} />
        </div>
        <h3 className="text-base font-semibold text-slate-900">No delivery address found</h3>
        <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500">
          Please add an address before continuing.
        </p>
        <button
          onClick={onAddAddress}
          className="mt-5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700 active:scale-[0.98]"
        >
          Add Address
        </button>
      </section>
    )
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <MapPin className="h-4.5 w-4.5 text-brand-600" strokeWidth={2.25} />
          Delivery Address
        </h2>
        <button
          onClick={onChangeAddress}
          className="group flex items-center gap-0.5 rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
        >
          Change
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="space-y-2.5 text-sm">
        <div className="flex items-center gap-2 font-medium text-slate-900">
          <User className="h-4 w-4 text-slate-400" />
          {data.fullName}
          <span className="mx-1 text-slate-300">•</span>
          <Phone className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-600">{data.mobile}</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          {data.houseStreet}, {data.area}
          <br />
          {data.city}, {data.state} {data.postalCode}
          <br />
          {data.country}
        </p>
      </div>
    </section>
  )
}
