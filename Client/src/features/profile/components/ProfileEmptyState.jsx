import { UserCircle2 } from "lucide-react";

export default function ProfileEmptyState({ onCreateProfile }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md animate-scale-in rounded-2xl bg-white p-10 text-center shadow-card">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-brand-100">
          <UserCircle2
            className="h-10 w-10 text-brand-500"
            strokeWidth={1.75}
          />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">
          Complete Your Profile
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
          Complete your profile to enjoy faster checkout and order tracking.
        </p>
        <button
          type="button"
          onClick={onCreateProfile}
          className="mt-7 w-full rounded-xl cursor-pointer bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:w-auto sm:px-8"
        >
          Create Profile
        </button>
      </div>
    </div>
  );
}
