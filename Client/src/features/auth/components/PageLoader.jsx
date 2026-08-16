
export default function PageLoader() {
  return (
    /* flex-grow and min-h push the container vertically, while flex items-center forces vertical centering */
    <div className="w-full flex-grow min-h-[70vh] flex flex-col items-center justify-center bg-white p-4 select-none">
      <div className="flex flex-col items-center space-y-3 max-w-xs text-center">
        
        {/* Sleek, Modern Micro-Spinner */}
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-slate-100" />
          <div className="absolute w-8 h-8 rounded-full border-2 border-transparent border-t-slate-900 animate-spin" />
        </div>

        {/* Clean, Premium Monospaced/Minimalist Typography */}
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 animate-pulse">
          Loading...
        </p>

      </div>
    </div>
  );
}
