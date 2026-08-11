import { Package, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrderCard({ order, onViewDetails }) {
  const itemCount = order.OrderItems?.length ?? 0;

  const totalUnits =
    order.OrderItems?.reduce((sum, item) => sum + item.qty, 0) ?? 0;

  // Show up to 3 product thumbnails as a quick visual preview.
  const previewImages = (order.OrderItems ?? []).slice(0, 3);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Order Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Order ID
          </p>

          <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
            #{order.id.slice(0, 8)}
          </p>
        </div>

        {/* Statuses */}
        <div className="flex flex-wrap justify-end gap-2">
          <StatusBadge type="order" status={order.orderStatus} size="sm" />

          <StatusBadge type="payment" status={order.paymentStatus} size="sm" />

          {order.refundStatus && (
            <StatusBadge type="refund" status={order.refundStatus} size="sm" />
          )}
        </div>
      </div>

      {/* Product Preview */}
      <div className="mt-4 flex items-center gap-3">
        {previewImages.length > 0 ? (
          <div className="flex -space-x-3">
            {previewImages.map((item, idx) => (
              <img
                key={item.productId ?? idx}
                src={item.productImage}
                alt={item.productTitle}
                className="h-12 w-12 rounded-lg object-cover ring-2 ring-white bg-slate-100"
                loading="lazy"
              />
            ))}

            {itemCount > 3 && (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs font-medium text-slate-500 ring-2 ring-white">
                +{itemCount - 3}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
            <Package className="h-5 w-5 text-slate-400" />
          </div>
        )}

        <div className="text-sm text-slate-500">
          {itemCount} {itemCount === 1 ? "product" : "products"} · {totalUnits}{" "}
          {totalUnits === 1 ? "unit" : "units"}
        </div>
      </div>

      {/* Order Footer */}
      <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-400">
            Placed on {formatDate(order.createdAt)}
          </p>

          <p className="mt-0.5 text-lg font-semibold text-slate-900">
            {formatCurrency(order.totalPrice / 100, order.currency)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(order)}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-900 hover:text-white hover:ring-slate-900"
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
