import { AlertCircle } from "lucide-react";

export default function ProfileErrorState({ onRetry, errorMsg }) {
  console.log(errorMsg);
  
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md animate-scale-in rounded-2xl bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-7 w-7 text-red-500" strokeWidth={2} />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">
          Unable to load profile
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {errorMsg?.message ||
            "Something went wrong while loading your profile."}
        </p>
        
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
