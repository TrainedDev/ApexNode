import { useState, useMemo, useEffect, useRef } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeProductFromCart, updateCart } from "../cartSlice";
import { cartProducts } from "../../products/productSlice";
import { Link } from "react-router-dom";
import { createOrder } from "../../order/orderSlice";
import { addMultipleProducts } from "../../checkout/checkoutSlice";

/* ------------------------------------------------------------- */
/* Helpers                                                       */
/* ------------------------------------------------------------- */
const toNumber = (value) => {
  if (value && typeof value === "object" && "$numberDecimal" in value) {
    return Number(value.$numberDecimal);
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const getDiscountedPrice = (product) => {
  const price = toNumber(product.price);

  const discount = toNumber(product.discountPercentage);

  return price * (1 - discount / 100);
};
const getLineTotal = (product, quantity) => {
  return getDiscountedPrice(product) * quantity;
};

/* ------------------------------------------------------------- */
/* Cart Component                                                */
/* ------------------------------------------------------------- */

export default function Cart() {
  const dispatch = useDispatch();

  const {
    fetchCart: { error, data, loading },
    updateCart: { error: updateCartError, data: updateCartData },
  } = useSelector((state) => state.cart);

  // Product information fetched from product service
  const [cartItems, setCartItems] = useState([]);

  // Actual cart data containing productId + quantity
  const [quantities, setQuantities] = useState([]);

  // Store debounce timers per product
  const debounceTimers = useRef({});
  const latestQuantities = useRef({});

  /* ----------------------------------------------------------- */
  /* Fetch Cart                                                  */
  /* ----------------------------------------------------------- */

  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        // 1. Get cart items
        const cartData = await dispatch(fetchCart()).unwrap();

        // console.log("Cart data:", cartData);

        // 2. Store cart quantities
        setQuantities(cartData);

        // 3. Store latest quantities in ref
        latestQuantities.current = Object.fromEntries(
          cartData.map((item) => [item.productId, item.quantity]),
        );

        // console.log(latestQuantities.current);
        
        // 4. Get product IDs
        const productIds = cartData.map((item) => item.productId);

        // 5. If cart is empty, don't fetch products
        if (productIds.length === 0) {
          setCartItems([]);
          return;
        }

        // 6. Fetch actual product details
        const products = await dispatch(cartProducts({ productIds })).unwrap();

        console.log("Cart products:", products);

        // 7. Store product details
        setCartItems(products);
      } catch (error) {
        console.error("Error fetching cart or products:", error);
      }
    };

    fetchUserCart();
  }, [dispatch]);
  /* ----------------------------------------------------------- */
  /* Cleanup Debounce Timers                                     */
  /* ----------------------------------------------------------- */

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  /* ----------------------------------------------------------- */
  /* Update Quantity                                             */
  /* ----------------------------------------------------------- */

  const updateQuantity = (product, delta) => {
    const productId = product._id;

    const currentCartProductQuantity = latestQuantities.current[productId] ?? 1;

    const stock = product?.stock

    // Don't allow quantity update if product has no stock
    if (stock <= 0) {
      // console.log("Product is out of stock");
      alert(`${product.title} is out of stock`);
      return;
    }

    const newQuantity = Math.min(stock, Math.max(1, currentCartProductQuantity + delta));

    if (newQuantity > 3) {
      alert("max 3 product can be ordered");
      return;
    };

    // console.log({
    //   productId,
    //   currentQuantity,
    //   delta,
    //   stock,
    //   newQuantity,
    // });

    latestQuantities.current[productId] = newQuantity;

    setQuantities((prev) =>
      prev.map((cartItem) =>
        cartItem.productId === productId
          ? {
              ...cartItem,
              quantity: newQuantity,
            }
          : cartItem,
      ),
    );

    if (debounceTimers.current[productId]) {
      clearTimeout(debounceTimers.current[productId]);
    }

    debounceTimers.current[productId] = setTimeout(() => {
      dispatch(
        updateCart({
          productId,
          quantity: newQuantity,
        }),
      );

      delete debounceTimers.current[productId];
    }, 500);
  };

  /* ----------------------------------------------------------- */
  /* Remove Item                                                 */
  /* ----------------------------------------------------------- */

  const removeItem = async (productId) => {
    try {
      // Cancel pending quantity update for this product
      if (debounceTimers.current[productId]) {
        clearTimeout(debounceTimers.current[productId]);
        delete debounceTimers.current[productId];
      }

      await dispatch(removeProductFromCart(productId)).unwrap();

      // Remove from local state immediately
      setQuantities((prev) =>
        prev.filter((item) => item.productId !== productId),
      );

      setCartItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.error("Failed to remove product:", error);
    }
  };

  /* ----------------------------------------------------------- */
  /* Calculate Subtotal                                          */
  /* ----------------------------------------------------------- */

  const subtotal = useMemo(() => {
    return quantities.reduce((sum, cartItem) => {
      const product = cartItems.find((item) => item._id === cartItem.productId);

      if (!product) {
        return sum;
      }

      return sum + product.discountPercentage.$numberDecimal * cartItem.quantity;
    }, 0);
  }, [quantities, cartItems]);

  const shipping = cartItems.length > 0 ? 5 : 0;

  const total = subtotal + shipping;

  /* ----------------------------------------------------------- */
  /* Loading / Error                                             */
  /* ----------------------------------------------------------- */

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-sm font-medium text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-sm font-medium text-red-500">Failed to load cart.</p>
      </div>
    );
  }

  /* ----------------------------------------------------------- */
  /* Empty Cart                                                  */
  /* ----------------------------------------------------------- */

  if (quantities.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-9 h-9 text-gray-400" />
          </div>

          <h2 className="text-lg font-bold text-gray-900">
            Your cart is empty
          </h2>

          <p className="text-sm mb-5 font-medium text-gray-500 mt-1">
            Looks like you haven't added anything yet.
          </p>

          <Link
            to="/"
            className="inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-[#2563eb] rounded-xl shadow-sm hover:bg-blue-700 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------- */
  /* UI                                                          */
  /* ----------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* --------------------------------------------------- */}
          {/* Cart Items                                           */}
          {/* --------------------------------------------------- */}

          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((product) => {
              const cartItem = quantities.find(
                (item) => item.productId === product._id,
              );

              if (!cartItem) {
                return null;
              }

              const discountedPrice = getDiscountedPrice(product);

              const lineTotal = getLineTotal(product, cartItem.quantity);

              return (
                <div
                  key={product._id}
                  className="flex gap-4 bg-white rounded-xl shadow-sm p-4"
                >
                  {/* Product Image */}

                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-24 h-24 rounded-lg object-contain bg-gray-50 p-2 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Product Header */}

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wide text-[#2563eb]">
                          {product.brand}
                        </span>

                        <h3 className="text-sm font-bold text-gray-900 mt-0.5 line-clamp-1">
                          {product.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => removeItem(product._id)}
                        aria-label="Remove item"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#dc2626] hover:bg-[#dc2626]/10 transition-all duration-200 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity + Price */}

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}

                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          disabled={
                            cartItem.quantity <= 1 || product.inStock <= 0
                          }
                          onClick={() => updateQuantity(product, -1)}
                          className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="w-9 text-center text-sm font-bold text-gray-900">
                          {cartItem.quantity}
                        </span>

                        <button
                          disabled={
                            cartItem.quantity >= product.inStock ||
                            product.inStock <= 0
                          }
                          onClick={() => updateQuantity(product, 1)}
                          className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}

                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ₹{lineTotal.toFixed(2)}
                        </p>

                        <p className="text-xs font-medium text-gray-400">
                          ₹{discountedPrice.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --------------------------------------------------- */}
          {/* Order Summary                                        */}
          {/* --------------------------------------------------- */}

          <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">
                  Subtotal ({quantities.length} items)
                </span>

                <span className="font-semibold text-gray-900">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Shipping</span>

                <span className="font-semibold text-gray-900">
                  ₹{shipping.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>

                <span className="font-bold text-gray-900 text-lg">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
            to={"/checkout"}
              className="w-full mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#2563eb] rounded-xl py-3 shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-300"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
