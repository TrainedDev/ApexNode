import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ShieldCheck } from "lucide-react";
import CheckoutAddress from "../component/CheckoutAddress";
import CheckoutProducts from "../component/CheckoutProducts";
import CheckoutPayment from "../component/CheckoutPayment";
import OrderSummary from "../component/OrderSummary";
import CheckoutSkeleton from "../component/CheckoutSkeleton";
import PaymentSuccess from "../component/PaymentSuccess";
import ErrorState from "../component/ErrorState";
import { fetchCart } from "../../cart/cartSlice";
import { createOrder } from "../../order/orderSlice";
import { useEffect } from "react";
import { fetchProfile } from "../../profile/profileSlice";
import { cartProducts, fetchProduct } from "../../products/productSlice";
import { handlePayment } from "../services/razorpay";
import { useParams } from "react-router-dom";

export default function Checkout() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // user profile selector
  const {
    data: user,
    loading: profileLoading,
    error: { fetchProfileErr },
  } = useSelector((state) => state.profile);

  //order selector
  const {
    createOrder: { data: orderData, error: orderError, loading: orderLoading },
  } = useSelector((state) => state.order);

  //product selector
  const {
    fetchProduct: { loading: singleItemLoading, error: singleItemError },
    cartProducts: { loading: itemsLoading, error: itemsError },
  } = useSelector((state) => state.product);

  //cart selector
  const {
    fetchCart: { loading: cartLoading, error: cartError },
  } = useSelector((state) => state.cart);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          await dispatch(fetchProfile()).unwrap();

          const fetchedProduct = await dispatch(fetchProduct(id)).unwrap();

          const buyingProduct = { ...fetchedProduct, qty: 1 };

          setItems((prev) => {
            const isItemExist = prev.find(
              (ele) => ele._id === buyingProduct._id,
            );
            if (!isItemExist) {
              return [...prev, buyingProduct];
            }
            return prev;
          });
        } else {
          const fetchCartData = await dispatch(fetchCart()).unwrap();
          await dispatch(fetchProfile()).unwrap();

          const productIds = fetchCartData.map((ele) => ele.productId);
          const fetchedProducts = await dispatch(
            cartProducts({ productIds }),
          ).unwrap();

          const itemsQty = Object.fromEntries(
            fetchCartData.map((ele) => [ele.productId, ele.quantity]),
          );

          const buyingProducts = fetchedProducts.map((ele) => ({
            ...ele,
            qty: itemsQty[ele._id],
          }));
          setItems(buyingProducts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch, id]);

  const handleRetry = () => {
    // Wire this up to your actual re-fetch / dispatch(fetchCheckout()) action.
    window.location.reload();
  };

  const handlePayNow = async () => {
    try {
      setIsPaying(true);
      if (!user || !items || items.length === 0) {
        setIsSuccess(false);

        setIsPaying(false);
        alert("inValid Details");
        return;
      }

      const orderDetails = items.map((ele) => ({
        productId: ele._id,
        productTitle: ele.title,
        buyingPrice: ele.discountPercentage.$numberDecimal,
        productImage: ele.thumbnail,
        qty: ele.qty,
      }));

      const res = await dispatch(
        createOrder({ orderDetails, address: user.address }),
      ).unwrap();
      if (res) {
        const {
          razorpayKeyId,
          newOrder: {
            totalPrice,
            currency,
            id: orderId,
            razorpay_order_id: razorpayOrderId,
          },
        } = res;

        handlePayment(
          razorpayKeyId,
          totalPrice,
          currency,
          "my buisness",
          "description",
          razorpayOrderId,
          user?.fullname,
          user?.phoneNumber,
          dispatch,
          setIsSuccess,
          setIsPaying,
          orderId,
        );
      }
    } catch (error) {
      setIsPaying(false);
      setIsSuccess(false);
      alert(error.message);
      console.log(error);
    }
  };

  if (profileLoading || itemsLoading || cartLoading || singleItemLoading)
    return <CheckoutSkeleton />;
  if (fetchProfileErr || itemsError || cartError || singleItemError)
    return (
      <ErrorState
        message={fetchProfileErr || cartError || itemsError || singleItemError}
        onRetry={handleRetry}
      />
    );
  if (isSuccess) {
    return (
      <PaymentSuccess
        // deliveryDate={cart?.items?.[0]?.deliveryDate}
        onContinueShopping={() => console.log("navigate to /shop")}
        onViewOrders={() => console.log("navigate to /orders")}
      />
    );
  }

  const totalPrice = items?.reduce(
    (acc, ele) => acc + ele.discountPercentage.$numberDecimal * ele.qty,
    0,
  );
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Checkout
          </h1>
          <div className="hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:flex">
            <ShieldCheck className="h-4 w-4" />
            256-bit encrypted checkout
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="space-y-6 animate-fade-in">
            <CheckoutAddress
              onChangeAddress={() => console.log("open address selector")}
              onAddAddress={() => console.log("open add address form")}
              data={user}
            />
            <CheckoutProducts items={items} />
            <CheckoutPayment />
          </div>

          {/* Right column */}
          <div className="animate-fade-in">
            <OrderSummary
              isPaying={isPaying}
              onPayNow={handlePayNow}
              totalPrice={totalPrice}
              items={items}
              hasAddress={Boolean(user?.address)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
