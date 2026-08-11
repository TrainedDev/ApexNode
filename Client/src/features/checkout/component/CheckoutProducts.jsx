import { Package, Truck, CheckCircle2 } from "lucide-react";

// const stockConfig = {
//   in_stock: { label: "In Stock", className: "bg-emerald-50 text-emerald-700" },
//   low_stock: {
//     label: "Only a few left",
//     className: "bg-amber-50 text-amber-700",
//   },
//   out_of_stock: { label: "Out of Stock", className: "bg-red-50 text-red-700" },
// };

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export default function CheckoutProducts({items}) {
if (!items) {
  return <>no data</>
}
  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
        <Package className="h-4.5 w-4.5 text-brand-600" strokeWidth={2.25} />
        Products
        <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          {items.length}
        </span>
      </h2>

      <div className="divide-y divide-slate-100">
        {items.map((item) => {
          const stock = item.stock;
          const total = item.qty * item.discountPercentage.$numberDecimal;
            
          return (
            <div
              key={item._id}
              className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
            >
              {/* Image */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-slate-100"
              />

              {/* Center info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {item.brand}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                  <span>Qty: {item.qty}</span>
                  <span className="text-slate-300">|</span>
                  <span>{formatCurrency(item.discountPercentage.$numberDecimal)} each</span>
                </div>
              </div>

              {/* Right info */}
              <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1.5">
             <div className="flex items-center gap-1.5 text-xs text-slate-500">
  <Truck className="h-3.5 w-3.5" />
  Estimated delivery in 3–5 days
</div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${stock.className}`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {stock.label}
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
