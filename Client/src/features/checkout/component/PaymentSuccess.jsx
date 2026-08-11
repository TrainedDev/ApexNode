import { CheckCircle2, Package, ArrowRight } from 'lucide-react'

export default function PaymentSuccess({ deliveryDate = 'Aug 10', onContinueShopping, onViewOrders }) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-scale-in rounded-2xl bg-white p-8 text-center shadow-card-hover sm:p-10">
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-75" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-11 w-11 text-emerald-500" strokeWidth={2} />
          </span>
        </div>

        <h1 className="text-xl font-bold text-slate-900">Payment Successful</h1>
        <p className="mt-1.5 text-sm text-slate-500">Order Placed Successfully</p>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <Package className="h-4 w-4 text-slate-400" />
          Estimated delivery by <span className="font-semibold text-slate-900">{deliveryDate}</span>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onContinueShopping}
            className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Continue Shopping
          </button>
          <button
            onClick={onViewOrders}
            className="group flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 active:scale-[0.98]"
          >
            View Orders
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
