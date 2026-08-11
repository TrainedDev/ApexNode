import { useEffect, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";

import OrderCard from "../components/OrderCard";
import OrderDetails from "../components/OrderDetails";
import OrderFilter from "../components/OrderFilter";
import OrderCardSkeleton from "../components/OrderCardSkeleton";
import {
  EmptyOrdersState,
  NoFilterResultsState,
  OrderErrorState,
} from "../components/OrderStates";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrder } from "../orderSlice";

export default function Order() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const {
    fetchOrder: { data: orders, loading, error },
  } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrder())
  }, [dispatch]);

  // ---------------------------------------------------------------------------

  const counts = useMemo(() => {
    return orders?.reduce(
      (acc, order) => {
        acc.all += 1;
        acc[order.paymentStatus] = (acc[order.paymentStatus] ?? 0) + 1;
        return acc;
      },
      { all: 0, pending: 0, complete: 0, failed: 0, canceled: 0 },
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((order) => order.paymentStatus === activeFilter);
  }, [orders, activeFilter]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">My Orders</h1>
            <p className="text-sm text-slate-500">
              Track and review everything you've bought
            </p>
          </div>
        </div>

        {/* Filters */}
        {!loading && orders?.length > 0 && (
          <div className="mb-6">
            <OrderFilter
              activeFilter={activeFilter}
              onChange={setActiveFilter}
              counts={counts}
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <OrderErrorState
            message={error.message || "failed to load Orders"}
            onRetry={window.location.href("/orders")}
          />
        )}

        {/* Empty (zero orders ever placed) */}
        {!orders ||
          (orders === null && !loading && !error && orders.length === 0 && (
            <EmptyOrdersState />
          ))}

        {/* Success with orders, but filter has no matches */}
        {orders && filteredOrders &&
          orders.length > 0 &&
          filteredOrders.length === 0 && (
            <NoFilterResultsState onReset={() => setActiveFilter("all")} />
          )}

        {/* Success with results to show */}
        {!loading && filteredOrders?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={setSelectedOrder}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details drawer */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
