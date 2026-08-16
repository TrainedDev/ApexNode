import { Lock, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";

export default function CheckoutPayment() {
  const {
    verifyPayment: { data: paymentData, error: paymentErr },
  } = useSelector((state) => state.payment);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
        <ShieldCheck
          className="h-4.5 w-4.5 text-brand-600"
          strokeWidth={2.25}
        />
        Payment Method
      </h2>

      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
          <span className="text-sm font-bold tracking-tight text-[#3395FF]">
            R<span className="text-[#0A2540]">zp</span>
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">
            Secure payment powered by Razorpay
          </p>
          <p className="text-xs text-slate-500">
            Cards, UPI, netbanking & wallets supported
          </p>
        </div>
      </div>

      {paymentData ? (
        <div className="mt-4 space-y-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm">
          {paymentErr ? (
            <div className="flex flex-col gap-2 max-w-md bg-white p-4 rounded-lg">
              {/* The original error row */}
              <div className="flex items-center gap-2 font-medium text-red-600">
                {/* Note: Swapped CheckCircle2 with an alert icon since payment failed */}
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-sm font-semibold">
                  Payment Failed:{" "}
                  {paymentErr?.message || "Transaction declined"}
                </span>
              </div>

              {/* Professional Reassurance Message */}
              <p className="text-xs text-slate-500 leading-relaxed pl-6">
                If any amount was deducted from your account, it will be
                automatically refunded by your bank within 2-5 business days.
                Your order has not been placed yet, and you have not been
                charged.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 bg-white p-4 max-w-md">
              <div className="flex items-center gap-2 font-medium text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-semibold">
                  Payment {paymentData?.success || "Successful"}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-7">
                Your order has been placed successfully. It might take a few
                moments to process completely; you can track its real-time
                status anytime on your{" "}
                <a
                  href="/orders"
                  className="text-indigo-600 underline font-medium"
                >
                  Orders Page
                </a>
                .
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
            <p>
              <span className="text-slate-400">Method:</span> {"Razorpay"}
            </p>
            {paymentData?.razorpayOrderId && (
              <p>
                <span className="text-slate-400">Order ID:</span>{" "}
                {paymentData?.razorpayOrderId}
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
  );
}
