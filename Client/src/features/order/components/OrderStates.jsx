import { PackageX, AlertTriangle, SearchX } from "lucide-react";

// Shown when the user has placed zero orders at all.
export function EmptyOrdersState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <PackageX className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">No orders yet</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">
        Items you buy will show up here so you can track delivery and payment status.
      </p>
      <a
        href="/"
        className="mt-5 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
      >
        Start Shopping
      </a>
    </div>
  );
}

// Shown when a filter tab produces zero matching results.
export function NoFilterResultsState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <SearchX className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">No orders match this filter</h3>
      <p className="text-sm text-slate-500 mt-1">Try a different status tab.</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 text-sm font-medium text-slate-900 underline underline-offset-2 hover:text-slate-600"
      >
        Show all orders
      </button>
    </div>
  );
}

// Shown when the order fetch fails.
export function OrderErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-rose-500" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">Couldn't load your orders</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">
        {message || "Something went wrong while fetching your order history."}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
