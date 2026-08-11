import { Heart, Loader2, ShoppingCart } from "lucide-react";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import { createCart } from "../../cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [loader, setLoader] = useState(null);
  const {
    createCart: { loading },
  } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const discountedPrice = product.discountPercentage.$numberDecimal;
  const originalPrice = product.price.$numberDecimal;
  const discountPercentage =
    ((originalPrice - discountedPrice) / originalPrice) * 100;
  const inStock = product.stock > 0;

  const handleCart = async (id) => {
    try {
      setLoader(id);
      const res = await dispatch(createCart(id)).unwrap();
      if(res) alert("product successfully added")
    } catch (error) {
      console.log(error);
      alert(error.error || "failed to add cart")
    }
  }

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-gray-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Wishlist */}
        <button
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white hover:text-[#dc2626] transition-all duration-200"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Stock badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
            inStock
              ? "bg-[#16a34a]/10 text-[#16a34a]"
              : "bg-[#dc2626]/10 text-[#dc2626]"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </span>

        {/* Discount badge */}
        {discountPercentage > 0 && (
          <span className="absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-[#2563eb] text-white">
            {discountPercentage.toFixed(2)}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] font-bold uppercase tracking-wide text-[#2563eb] mb-1">
          {product.brand}
        </span>
        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-xs font-medium text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-2">
          <Rating value={product.rating} />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-base font-bold text-gray-900">
            ₹{discountedPrice}
          </span>
          {product.discountPercentage.$numberDecimal > 0 && (
            <span className="text-xs font-medium text-gray-400 line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            className="flex-1 text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-all duration-200"
            key={product._id}
            to={`/product/${product._id}`}
          >
            View Details
          </Link>
          <button
            disabled={!inStock}
            onClick={() => handleCart(product?._id) }
            className={`flex-1 flex items-center cursor-pointer justify-center gap-1.5 text-xs font-semibold rounded-lg py-2 transition-all duration-300 ${
              inStock
                ? "bg-[#2563eb] text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading && loader === product?._id ? (
              <Loader2 className=" animate-spin" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5" />
            )}
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
