import Filters from "../components/Filters";
import EmptyProducts from "../components/EmptyProducts";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";

import { useSelector, useDispatch } from "react-redux";
import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";

import { fetchProducts } from "../productSlice";
import axios from "axios";
import { axiosInstance } from "../../../lib/axios";

const DISCOUNT_BANDS = [
  { label: "0% - 10%", min: 0, max: 10 },
  { label: "10% - 20%", min: 10, max: 20 },
  { label: "20% - 40%", min: 20, max: 40 },
  { label: "40% & above", min: 40, max: Infinity },
];

const DEFAULT_FILTERS = {
  minPrice: "",
  maxPrice: "",
  discounts: [],
  brands: [],
  availability: [],
};

export default function Product() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    fetchProducts: {
      data: productData,
      error,
      loading,
    },
  } = useSelector((state) => state.product);

  const dispatch = useDispatch();

  // --------------------------------
  // Products
  // --------------------------------

  const ALL_PRODUCTS = productData ?? [];

  const PAGE_SIZE = ALL_PRODUCTS.length || 1;

  // --------------------------------
  // Brands
  // --------------------------------

  const brands = useMemo(
    () => [...new Set(ALL_PRODUCTS.map((product) => product.brand))],
    [ALL_PRODUCTS],
  );

  // --------------------------------
  // Filtering
  // --------------------------------

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const discounted =
        product.price * (1 - product.discountPercentage / 100);

      // Price
      if (
        appliedFilters.minPrice &&
        discounted < Number(appliedFilters.minPrice)
      ) {
        return false;
      }

      if (
        appliedFilters.maxPrice &&
        discounted > Number(appliedFilters.maxPrice)
      ) {
        return false;
      }

      // Discount
      if (appliedFilters.discounts.length > 0) {
        const matchesBand = DISCOUNT_BANDS.some(
          (band) =>
            appliedFilters.discounts.includes(band.label) &&
            product.discountPercentage >= band.min &&
            product.discountPercentage < band.max,
        );

        if (!matchesBand) {
          return false;
        }
      }

      // Brand
      if (
        appliedFilters.brands.length > 0 &&
        !appliedFilters.brands.includes(product.brand)
      ) {
        return false;
      }

      // Availability
      if (appliedFilters.availability.length > 0) {
        const status =
          product.stock > 0 ? "In Stock" : "Out Of Stock";

        if (!appliedFilters.availability.includes(status)) {
          return false;
        }
      }

      return true;
    });
  }, [appliedFilters, ALL_PRODUCTS]);

  // --------------------------------
  // Pagination
  // --------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // --------------------------------
  // Handlers
  // --------------------------------

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

  const handleRetry = () => {
    dispatch(fetchProducts());
  };

  // --------------------------------
  // Fetch products
  // --------------------------------

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =========================
            PAGE HEADING
        ========================== */}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              All Products
            </h1>

            {!loading && !error && (
              <p className="text-sm font-medium text-gray-500 mt-1">
                {filteredProducts.length} products found
              </p>
            )}
          </div>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            disabled={loading}
            className="
              lg:hidden
              flex items-center gap-2
              px-4 py-2.5
              text-sm font-semibold
              text-gray-700
              bg-white
              border border-gray-200
              rounded-xl
              shadow-sm
              hover:bg-gray-50
              transition-all duration-200
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-8 items-start">

          {/* =========================
              DESKTOP FILTERS
          ========================== */}

          <aside className="hidden lg:block w-70 shrink-0 sticky top-24">
            <Filters
              brands={brands}
              filters={filters}
              setFilters={setFilters}
              onReset={handleReset}
              onApply={handleApply}
            />
          </aside>

          {/* =========================
              PRODUCT CONTENT
          ========================== */}

          <div className="flex-1 min-w-0">

            {/* =========================
                LOADING
            ========================== */}

            {loading && (
              <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                <Loader2
                  className="
                    w-10 h-10
                    text-[#2563eb]
                    animate-spin
                  "
                />

                <h2 className="mt-5 text-lg font-bold text-gray-900">
                  Loading products...
                </h2>

                <p className="mt-2 text-sm text-gray-500 max-w-md">
                  The product server may be waking up. This can take
                  a little longer than usual.
                </p>
              </div>
            )}

            {/* =========================
                ERROR
            ========================== */}

            {!loading && error && (
              <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                <div
                  className="
                    w-14 h-14
                    flex items-center justify-center
                    rounded-full
                    bg-red-50
                    text-red-500
                  "
                >
                  <X className="w-7 h-7" />
                </div>

                <h2 className="mt-5 text-lg font-bold text-gray-900">
                  Unable to load products
                </h2>

                <p className="mt-2 max-w-md text-sm text-gray-500">
                  {error?.message ||
                    error ||
                    "Something went wrong while loading products."}
                </p>

                <button
                  onClick={handleRetry}
                  className="
                    mt-5
                    px-5 py-2.5
                    rounded-xl
                    bg-[#2563eb]
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-blue-700
                    transition-colors
                  "
                >
                  Try Again
                </button>
              </div>
            )}

            {/* =========================
                PRODUCTS
            ========================== */}

            {!loading &&
              !error &&
              paginatedProducts.length > 0 && (
                <>
                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      lg:grid-cols-3
                      xl:grid-cols-4
                      gap-5
                    "
                  >
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                      />
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}

            {/* =========================
                EMPTY
            ========================== */}

            {!loading &&
              !error &&
              paginatedProducts.length === 0 && (
                <EmptyProducts onReset={handleReset} />
              )}
          </div>
        </div>
      </div>

      {/* =========================
          MOBILE FILTER DRAWER
      ========================== */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* Overlay */}

          <div
            className="
              absolute inset-0
              bg-black/40
              transition-opacity duration-300
            "
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Drawer */}

          <div
            className="
              absolute right-0 top-0
              h-full
              w-[85%]
              max-w-sm
              bg-[#f8fafc]
              shadow-xl
              overflow-y-auto
              p-5
              animate-in
              slide-in-from-right
              duration-300
            "
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Filters
              </h2>

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="
                  p-2
                  rounded-lg
                  hover:bg-gray-200
                  transition-colors duration-200
                "
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