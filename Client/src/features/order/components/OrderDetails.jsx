import { useEffect } from "react";
import { X, MapPin, CreditCard, Calendar, Receipt } from "lucide-react";
import StatusBadge from "./StatusBadge";

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrderDetails({ order, onClose }) {
  // Close on Escape for keyboard users.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!order) return null;

  const items = order.OrderItems ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        aria-label="Close order details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-[fadeIn_0.15s_ease-out]"
      />

      {/* Drawer */}
      <div className="relative h-full w-full max-w-lg bg-white shadow-2xl flex flex-col animate-[slideIn_0.2s_ease-out]">
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Order Details
            </p>
            <p className="text-base font-semibold text-slate-900 mt-0.5">
              #{order.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Status + Total */}
        <div className="space-y-3">
  <div className="flex flex-wrap items-center gap-2">
    {order.orderStatus && (
      <StatusBadge
        type="order"
        status={order.orderStatus}
      />
    )}

    {order.paymentStatus && (
      <StatusBadge
        type="payment"
        status={order.paymentStatus}
      />
    )}

    {order.refundStatus && (
      <StatusBadge
        type="refund"
        status={order.refundStatus}
      />
    )}
  </div>

  <p className="text-xl font-semibold text-slate-900">
    {formatCurrency(order.totalPrice / 100, order.currency)}
  </p>
</div>

          {/* Meta info */}
          <div className="rounded-xl bg-slate-50 ring-1 ring-slate-100 divide-y divide-slate-200">
            <InfoRow icon={Calendar} label="Order date" value={formatDate(order.createdAt)} />
            <InfoRow icon={MapPin} label="Delivery address" value={order.address} />
            <InfoRow
              icon={CreditCard}
              label="Razorpay Payment ID"
              value={order.razorpay_payment_id || "Not generated yet"}
              muted={!order.razorpay_payment_id}
            />
            <InfoRow
              icon={Receipt}
              label="Razorpay Order ID"
              value={order.razorpay_order_id || "Not available"}
              muted={!order.razorpay_order_id}
            />
          </div>

          {/* Products */}
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-3">
              Products ({items.length})
            </p>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.productId ?? idx}
                  className="flex items-center gap-3 rounded-xl ring-1 ring-slate-100 p-3"
                >
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    className="h-16 w-16 rounded-lg object-cover bg-slate-100 shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {item.productTitle}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatCurrency(item.buyingPrice, order.currency)} × {item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 shrink-0">
                    {formatCurrency(item.buyingPrice * item.qty, order.currency)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer total */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
          <span className="text-sm font-medium text-slate-500">Order Total</span>
          <span className="text-lg font-semibold text-slate-900">
            {formatCurrency(order.totalPrice/100, order.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, muted }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p
          className={`text-sm mt-0.5 break-words ${
            muted ? "text-slate-400 italic" : "text-slate-700 font-medium"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
