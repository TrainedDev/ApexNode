export default function AuthInput({
  id,
  label,
  type = "text",
  icon: Icon,
  placeholder,
  registration,
  error,
  autoComplete,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 dark:text-gray-500 pointer-events-none"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-2.5 text-sm font-medium rounded-lg bg-white dark:bg-gray-800/60 border text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
            error
              ? "border-[#dc2626] focus:ring-[#dc2626]/30 focus:border-[#dc2626]"
              : "border-gray-200 dark:border-gray-700 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
          }`}
          {...registration}
        />
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-[#dc2626] mt-1.5"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
