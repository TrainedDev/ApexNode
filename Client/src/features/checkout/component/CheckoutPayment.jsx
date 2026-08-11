import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useSelector } from 'react-redux'

export default function CheckoutPayment() {
  const { order } = useSelector((state) => state.checkout)
  const paymentData = order?.create?.data

  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
        <ShieldCheck className="h-4.5 w-4.5 text-brand-600" strokeWidth={2.25} />
        Payment Method
      </h2>

      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
          <span className="text-sm font-bold tracking-tight text-[#3395FF]">
            R<span className="text-[#0A2540]">zp</span>
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">Secure payment powered by Razorpay</p>
          <p className="text-xs text-slate-500">Cards, UPI, netbanking & wallets supported</p>
        </div>
      </div>

      {paymentData ? (
        <div className="mt-4 space-y-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm">
          <div className="flex items-center gap-2 font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Payment {paymentData.paymentStatus || 'Successful'}
          </div>
          <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
            <p>
              <span className="text-slate-400">Method:</span> {paymentData.method || 'Razorpay'}
            </p>
            {paymentData.razorpayOrderId && (
              <p>
                <span className="text-slate-400">Order ID:</span> {paymentData.razorpayOrderId}
              </p>
            )}
            {paymentData.paymentId && (
              <p className="sm:col-span-2">
                <span className="text-slate-400">Payment ID:</span> {paymentData.paymentId}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          Payment will be completed securely after clicking Pay Now.
        </div>
      )}
    </section>
  )
}
