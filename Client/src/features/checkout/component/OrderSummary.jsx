import { Loader2 } from "lucide-react";


function formatCurrency(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export default function OrderSummary({
  isPaying,
  onPayNow,
  hasAddress,
  totalPrice,
  items,
}) { 
if (!items) {
  return <>no data</>
}
  const disabled = isPaying || !hasAddress || items.length === 0;

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <section className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="mb-5 text-base font-semibold text-slate-900">
          Order Summary
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between text-slate-600">
            <span>
              Total Items ({items.length}{" "}
              {items.length === 1 ? "item" : "items"})
            </span>

            <span className="font-medium text-slate-900">{items.length}</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Order Total</span>

            <span className="font-semibold text-slate-900">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>

        <div className="my-5 border-t border-dashed border-slate-200" />

        <div className="mb-6 flex items-center justify-between">
          <span className="text-base font-semibold text-slate-900">
            Amount to Pay
          </span>

          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(totalPrice)}
          </span>
        </div>
        <button
          onClick={() => onPayNow(totalPrice)}
          disabled={disabled}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPaying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Secure Payment...
            </>
          ) : (
            `Pay ${formatCurrency(totalPrice)}`
          )}
        </button>

        {!hasAddress && (
          <p className="mt-2.5 text-center text-xs text-red-500">
            Add a delivery address to continue.
          </p>
        )}
      </section>
    </aside>
  );
}
