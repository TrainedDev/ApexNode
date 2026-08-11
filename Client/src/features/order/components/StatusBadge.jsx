import {
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  PackageCheck,
  Truck,
  RotateCcw,
  CreditCard,
} from "lucide-react";

export const STATUS_CONFIG = {
  // --------------------
  // Order statuses
  // --------------------
  order: {
    pending: {
      label: "Order Pending",
      icon: Clock,
      badgeClass: "bg-amber-50 text-amber-700 ring-amber-600/20",
      dotClass: "bg-amber-500",
    },

    confirmed: {
      label: "Confirmed",
      icon: CheckCircle2,
      badgeClass: "bg-blue-50 text-blue-700 ring-blue-600/20",
      dotClass: "bg-blue-500",
    },

    shipped: {
      label: "Shipped",
      icon: Truck,
      badgeClass: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
      dotClass: "bg-indigo-500",
    },

    delivered: {
      label: "Delivered",
      icon: PackageCheck,
      badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      dotClass: "bg-emerald-500",
    },

    canceled: {
      label: "Canceled",
      icon: Ban,
      badgeClass: "bg-slate-100 text-slate-600 ring-slate-500/20",
      dotClass: "bg-slate-400",
    },
  },

  // --------------------
  // Payment statuses
  // --------------------
  payment: {
    pending: {
      label: "Payment Pending",
      icon: Clock,
      badgeClass: "bg-amber-50 text-amber-700 ring-amber-600/20",
      dotClass: "bg-amber-500",
    },

    captured: {
      label: "Paid",
      icon: CreditCard,
      badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      dotClass: "bg-emerald-500",
    },

    failed: {
      label: "Payment Failed",
      icon: XCircle,
      badgeClass: "bg-rose-50 text-rose-700 ring-rose-600/20",
      dotClass: "bg-rose-500",
    },
  },

  // --------------------
  // Refund statuses
  // --------------------
  refund: {
    pending: {
      label: "Refund Pending",
      icon: Clock,
      badgeClass: "bg-amber-50 text-amber-700 ring-amber-600/20",
      dotClass: "bg-amber-500",
    },

    processed: {
      label: "Refunded",
      icon: RotateCcw,
      badgeClass: "bg-purple-50 text-purple-700 ring-purple-600/20",
      dotClass: "bg-purple-500",
    },

    failed: {
      label: "Refund Failed",
      icon: XCircle,
      badgeClass: "bg-rose-50 text-rose-700 ring-rose-600/20",
      dotClass: "bg-rose-500",
    },
  },
};

export default function StatusBadge({
  type = "payment",
  status,
  size = "md",
}) {
  if (!status) return null;

  const typeConfig = STATUS_CONFIG[type] ?? STATUS_CONFIG.payment;

  const config =
    typeConfig[status] ?? {
      label: status,
      icon: Clock,
      badgeClass: "bg-slate-100 text-slate-600 ring-slate-500/20",
      dotClass: "bg-slate-400",
    };

  const Icon = config.icon;

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5 gap-1"
      : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset ${config.badgeClass} ${sizeClasses}`}
    >
      <Icon
        className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"}
        strokeWidth={2.5}
      />

      {config.label}
    </span>
  );
}