import {
  Star,
} from "lucide-react";

export default function Rating({ value }) {
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