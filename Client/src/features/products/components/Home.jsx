import { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  X,
  Star,
  Heart,
  ShoppingCart,
  PackageX,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Dummy product data — shaped like the MongoDB product schema.        */
/* Replace this with an API call (e.g. GET /api/products) later.       */
/* ------------------------------------------------------------------ */
const BRAND_POOL = [
  "Nova",
  "Apexa",
  "Urban Craft",
  "Nimbus",
  "Forge & Co",
  "Lumen",
  "Pulse",
];

const TITLE_POOL = [
  "Wireless Headphones",
  "Running Sneakers",
  "Smart Watch",
  "Leather Backpack",
  "Bluetooth Speaker",
  "Cotton T-Shirt",
  "Sunglasses",
  "Desk Lamp",
  "Coffee Maker",
  "Yoga Mat",
];

function generateProducts(count) {
  return Array.from({ length: count }, (_, i) => {
    const price = 40 + ((i * 37) % 460);
    const discountPercentage = [0, 5, 12, 18, 25, 35, 45][i % 7];
    const stock = (i * 13) % 20;
    const brand = BRAND_POOL[i % BRAND_POOL.length];
    const title = TITLE_POOL[i % TITLE_POOL.length];

    return {
      id: i + 1,
      title: `${brand} ${title}`,
      description:
        "Premium quality build with a comfortable, everyday design that's made to last.",
      price,
      discountPercentage,
      rating: +(3 + ((i % 5) * 0.4)).toFixed(1),
      stock,
      brand,
      thumbnail: `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent(
        title
      )}`,
      images: [],
      availabilityStatus: stock > 0 ? "In Stock" : "Out of Stock",
      shippingInformation: "Ships in 3-5 business days",
      warrantyInformation: "1 year warranty",
      returnPolicy: "30 days return policy",
    };
  });
}

const ALL_PRODUCTS = generateProducts(32);
const PAGE_SIZE = 12;

const DISCOUNT_BANDS = [
  { label: "0% - 10%", min: 0, max: 10 },
  { label: "10% - 20%", min: 10, max: 20 },
  { label: "20% - 40%", min: 20, max: 40 },
  { label: "40% & above", min: 40, max: Infinity },
];

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */
function Rating({ value }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "text-gray-200"
          }`}
        />
      ))}
      <span className="text-xs font-semibold text-gray-500 ml-1">
        {value}
      </span>
    </div>
  );
}

function ProductCard({ product }) {
  const discounted = product.price * (1 - product.discountPercentage / 100);
  const inStock = product.stock > 0;

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
        {product.discountPercentage > 0 && (
          <span className="absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-[#2563eb] text-white">
            {product.discountPercentage}% OFF
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
            ${discounted.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-xs font-medium text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <button className="flex-1 text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-all duration-200">
            View Details
          </button>
          <button
            disabled={!inStock}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg py-2 transition-all duration-300 ${
              inStock
                ? "bg-[#2563eb] text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyProducts({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <PackageX className="w-9 h-9 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">No Products Found</h3>
      <p className="text-sm font-medium text-gray-500 mt-1 max-w-xs">
        Try adjusting your filters to find what you're looking for.
      </p>
      <button
        onClick={onReset}
        className="mt-5 px-5 py-2.5 text-sm font-semibold text-white bg-[#2563eb] rounded-xl shadow-sm hover:bg-blue-700 transition-all duration-300"
      >
        Reset Filters
      </button>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3.5 py-2 text-sm font-semibold rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 text-sm font-semibold rounded-lg transition-all duration-200 ${
            page === currentPage
              ? "bg-[#2563eb] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3.5 py-2 text-sm font-semibold rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
      >
        Next
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Filters sidebar (shared between desktop panel and mobile drawer)    */
/* ------------------------------------------------------------------ */
function Filters({ brands, filters, setFilters, onReset, onApply }) {
  const toggleInArray = (key, value) => {
    setFilters((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      };
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 space-y-6">
      {/* Price */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Price</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
            }
            className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40 focus:border-[#2563eb] transition-all duration-200"
          />
          <span className="text-gray-400 text-sm">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
            }
            className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40 focus:border-[#2563eb] transition-all duration-200"
          />
        </div>
      </div>

      {/* Discount */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Discount</h4>
        <div className="space-y-2.5">
          {DISCOUNT_BANDS.map((band) => (
            <label
              key={band.label}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.discounts.includes(band.label)}
                onChange={() => toggleInArray("discounts", band.label)}
                className="w-4 h-4 rounded accent-[#2563eb]"
              />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                {band.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand - derived dynamically from products */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Brand</h4>
        <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleInArray("brands", brand)}
                className="w-4 h-4 rounded accent-[#2563eb]"
              />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">
          Availability
        </h4>
        <div className="space-y-2.5">
          {["In Stock", "Out Of Stock"].map((status) => (
            <label
              key={status}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.availability.includes(status)}
                onChange={() => toggleInArray("availability", status)}
                className="w-4 h-4 rounded accent-[#2563eb]"
              />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                {status}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={onReset}
          className="flex-1 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-all duration-200"
        >
          Reset
        </button>
        <button
          onClick={onApply}
          className="flex-1 text-sm font-semibold text-white bg-[#2563eb] rounded-lg py-2.5 hover:bg-blue-700 transition-all duration-300"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Home page                                                            */
/* ------------------------------------------------------------------ */
const DEFAULT_FILTERS = {
  minPrice: "",
  maxPrice: "",
  discounts: [],
  brands: [],
  availability: [],
};

export default function Home() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const brands = useMemo(
    () => [...new Set(ALL_PRODUCTS.map((p) => p.brand))],
    []
  );

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const discounted =
        product.price * (1 - product.discountPercentage / 100);

      if (appliedFilters.minPrice && discounted < Number(appliedFilters.minPrice))
        return false;
      if (appliedFilters.maxPrice && discounted > Number(appliedFilters.maxPrice))
        return false;

      if (appliedFilters.discounts.length > 0) {
        const matchesBand = DISCOUNT_BANDS.some(
          (band) =>
            appliedFilters.discounts.includes(band.label) &&
            product.discountPercentage >= band.min &&
            product.discountPercentage < band.max
        );
        if (!matchesBand) return false;
      }

      if (
        appliedFilters.brands.length > 0 &&
        !appliedFilters.brands.includes(product.brand)
      )
        return false;

      if (appliedFilters.availability.length > 0) {
        const status = product.stock > 0 ? "In Stock" : "Out Of Stock";
        if (!appliedFilters.availability.includes(status)) return false;
      }

      return true;
    });
  }, [appliedFilters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleApply = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setMobileFiltersOpen(false);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading + mobile filter trigger */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              All Products
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {filteredProducts.length} products found
            </p>
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all duration-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-8 items-start">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-24">
            <Filters
              brands={brands}
              filters={filters}
              setFilters={setFilters}
              onReset={handleReset}
              onApply={handleApply}
            />
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <EmptyProducts onReset={handleReset} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 transition-opacity duration-300"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#f8fafc] shadow-xl overflow-y-auto p-5 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <Filters
              brands={brands}
              filters={filters}
              setFilters={setFilters}
              onReset={handleReset}
              onApply={handleApply}
            />
          </div>
        </div>
      )}
    </div>
  );
}
