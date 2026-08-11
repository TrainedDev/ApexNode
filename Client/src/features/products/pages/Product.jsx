import Filters from "../components/Filters";
import EmptyProducts from "../components/EmptyProducts";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { fetchProducts } from "../productSlice";

const DISCOUNT_BANDS = [
  { label: "0% - 10%", min: 0, max: 10 },
  { label: "10% - 20%", min: 10, max: 20 },
  { label: "20% - 40%", min: 20, max: 40 },
  { label: "40% & above", min: 40, max: Infinity },
];

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
      rating: +(3 + (i % 5) * 0.4).toFixed(1),
      stock,
      brand,
      thumbnail: `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent(
        title,
      )}`,
      images: [],
      availabilityStatus: stock > 0 ? "In Stock" : "Out of Stock",
      shippingInformation: "Ships in 3-5 business days",
      warrantyInformation: "1 year warranty",
      returnPolicy: "30 days return policy",
    };
  });
}

export default function Product() {
  const DEFAULT_FILTERS = {
    minPrice: "",
    maxPrice: "",
    discounts: [],
    brands: [],
    availability: [],
  };

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    fetchProducts: { data: productData, error, loading },
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const ALL_PRODUCTS = productData;
  const PAGE_SIZE = productData?.length;

  const brands = useMemo(
    () => [...new Set(ALL_PRODUCTS.map((p) => p.brand))],
    [ALL_PRODUCTS],
  );

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const discounted = product.price * (1 - product.discountPercentage / 100);

      if (
        appliedFilters.minPrice &&
        discounted < Number(appliedFilters.minPrice)
      )
        return false;
      if (
        appliedFilters.maxPrice &&
        discounted > Number(appliedFilters.maxPrice)
      )
        return false;

      if (appliedFilters.discounts.length > 0) {
        const matchesBand = DISCOUNT_BANDS.some(
          (band) =>
            appliedFilters.discounts.includes(band.label) &&
            product.discountPercentage >= band.min &&
            product.discountPercentage < band.max,
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
  }, [appliedFilters, ALL_PRODUCTS]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading + mobile filter trigger */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
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
          <aside className="hidden lg:block w-70 shrink-0 sticky top-24">
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
                      <ProductCard key={product._id} product={product} />
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
