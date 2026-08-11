import { PackageX } from "lucide-react";

export default function EmptyProducts({ onReset }) {
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