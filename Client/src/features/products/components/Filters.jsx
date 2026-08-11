
const DISCOUNT_BANDS = [
  { label: "0% - 10%", min: 0, max: 10 },
  { label: "10% - 20%", min: 10, max: 20 },
  { label: "20% - 40%", min: 20, max: 40 },
  { label: "40% & above", min: 40, max: Infinity },
];
export default function Filters({ brands, filters, setFilters, onReset, onApply }) {
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
          {brands.map((brand, i) => (
            <label
              key={i}
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