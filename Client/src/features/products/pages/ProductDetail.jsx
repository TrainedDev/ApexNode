import { useEffect, useState } from "react";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  CheckCircle2,
  Loader2,
  XCircleIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../productSlice";
import { Link, useParams } from "react-router-dom";
import { createCart } from "../../cart/cartSlice";


function Rating({ value, size = "w-4 h-4" }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProductDetail() {
  const { id } = useParams();
  const {
    fetchProduct: { data: productDetail, error, loading },
  } = useSelector((state) => state.product);
  const {
    createCart: { loading: cartLoading },
  } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToast, setAddedToast] = useState({});

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error...</div>;
  }

  if (productDetail) {
    const PRODUCT = productDetail;
    const gallery = [PRODUCT?.thumbnail, ...PRODUCT.images];
    const discountedPrice = PRODUCT.discountPercentage.$numberDecimal;
    const originalPrice = PRODUCT.price.$numberDecimal;
    const discountPercentage =
      ((originalPrice - discountedPrice) / originalPrice) * 100;
    const inStock = PRODUCT.stock > 0;

    const handleAddToCart = async () => {
      try {       
        const res = await dispatch(createCart(id)).unwrap();
        setAddedToast({
          success: true,
          msg: res.msg,
        });
      } catch (err) {
        console.log(err);
        
        setAddedToast({
          success: false,
          msg: err.error || err.message || "failed to add product in cart",
        });
      }
    };

    const step = () => {
      // Quantity moves in steps of the minimum order quantity
      return PRODUCT.minimumOrderQuantity || 1;
    };

    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <p className="text-xs font-medium text-gray-500 mb-6 capitalize">
            {PRODUCT.category} / {PRODUCT.brand} /{" "}
            <span className="text-gray-900 font-semibold">{PRODUCT.title}</span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Gallery */}
            <div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden aspect-square">
                <img
                  src={activeImage || PRODUCT?.thumbnail}
                  alt={PRODUCT.title}
                  className="w-full h-full object-contain p-6 transition-transform duration-300"
                />
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {gallery.map((img) => (
                    <button
                      key={img}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        activeImage === img
                          ? "border-[#2563eb]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-contain p-1 bg-white"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-[#2563eb]">
                {PRODUCT.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {PRODUCT.title}
              </h1>

              <div className="flex items-center gap-3 mt-3">
                <Rating value={PRODUCT.rating} />
                <span className="text-sm font-semibold text-gray-500">
                  {PRODUCT.rating} ({PRODUCT.reviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mt-5">
                <span className="text-3xl font-bold text-gray-900">
                  ${discountedPrice}
                </span>
                {discountPercentage > 0 && (
                  <>
                    <span className="text-base font-medium text-gray-400 line-through">
                      ${originalPrice}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#2563eb]/10 text-[#2563eb]">
                      {discountPercentage.toFixed(0)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock badge */}
              <span
                className={`inline-block mt-4 text-xs font-bold px-2.5 py-1 rounded-full ${
                  inStock
                    ? "bg-[#16a34a]/10 text-[#16a34a]"
                    : "bg-[#dc2626]/10 text-[#dc2626]"
                }`}
              >
                {PRODUCT.availabilityStatus} · {PRODUCT.stock} units left
              </span>

              <p className="text-sm font-medium text-gray-600 leading-relaxed mt-5">
                {PRODUCT.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {PRODUCT.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600 capitalize"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Quantity + actions */}
              <div className="mt-6">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Minimum order quantity: {PRODUCT.minimumOrderQuantity}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        setQuantity((q) =>
                          Math.max(PRODUCT.minimumOrderQuantity, q - step()),
                        )
                      }
                      className="p-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.min(PRODUCT.stock, q + step()))
                      }
                      className="p-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setWishlisted((w) => !w)}
                    aria-label="Toggle wishlist"
                    className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                      wishlisted
                        ? "border-[#dc2626] bg-[#dc2626]/10 text-[#dc2626]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Heart
                      className={`w-4.5 h-4.5 ${wishlisted ? "fill-[#dc2626]" : ""}`}
                    />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    disabled={loading}
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl py-3 transition-all duration-300 ${
                      inStock
                        ? "border border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb]/5"
                        : "border border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {cartLoading ? (
                      <Loader2 className=" animate-spin" />
                    ) : (
                      <ShoppingCart className="w-4.5 h-4.5" />
                    )}
                    Add to Cart
                  </button>
                  <Link to={`/checkout/${PRODUCT._id}`}
                    disabled={!inStock}
                    className={`flex-1 text-sm flex items-center justify-center font-semibold rounded-xl py-3 shadow-sm transition-all duration-300 ${
                      inStock
                        ? "bg-[#2563eb] text-white hover:bg-blue-700 hover:shadow-md"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Buy Now
                  </Link>
                </div>
              </div>

              {/* Info strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div className="flex items-start gap-2 bg-white rounded-xl p-3 shadow-sm">
                  <Truck className="w-4.5 h-4.5 text-[#2563eb] shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-gray-600">
                    {PRODUCT.shippingInformation}
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-white rounded-xl p-3 shadow-sm">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#2563eb] shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-gray-600">
                    {PRODUCT.warrantyInformation}
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-white rounded-xl p-3 shadow-sm">
                  <RotateCcw className="w-4.5 h-4.5 text-[#2563eb] shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-gray-600">
                    {PRODUCT.returnPolicy}
                  </p>
                </div>
              </div>

              {/* Specs */}
              <div className="mt-6 bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  Product Specifications
                </h3>
                <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
                  <dt className="font-medium text-gray-500">SKU</dt>
                  <dd className="font-semibold text-gray-900">{PRODUCT.sku}</dd>
                  <dt className="font-medium text-gray-500">Weight</dt>
                  <dd className="font-semibold text-gray-900">
                    {PRODUCT.weight}g
                  </dd>
                  <dt className="font-medium text-gray-500">Dimensions</dt>
                  <dd className="font-semibold text-gray-900">
                    {PRODUCT.dimensions.width} × {PRODUCT.dimensions.height} ×{" "}
                    {PRODUCT.dimensions.depth} cm
                  </dd>
                  <dt className="font-medium text-gray-500">Barcode</dt>
                  <dd className="font-semibold text-gray-900">
                    {PRODUCT.meta.barcode}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Customer Reviews
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCT.reviews.map((review, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <Rating value={review.rating} size="w-3.5 h-3.5" />
                    <span className="text-xs font-medium text-gray-400">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-3">
                    "{review.comment}"
                  </p>
                  <p className="text-xs font-bold text-gray-900 mt-3">
                    {review.reviewerName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add to cart toast */}
        {addedToast.msg && (
          <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
            {addedToast.success ? (
              <>
                <CheckCircle2 className="w-4.5 h-4.5 text-green-500" />
                <span>{addedToast.msg}</span>
              </>
            ) : (
              <>
                <XCircleIcon className="w-4.5 h-4.5 text-red-500" />
                <span>{addedToast.msg}</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
}
