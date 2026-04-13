"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 px-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
          Something went wrong
        </h2>
        <p className="text-sm text-zinc-500 max-w-md">
          {error.message || "An unexpected error occurred."}
        </p>
      </div>
      <button
        onClick={reset}
        className="px-8 py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all"
      >
        Try again
      </button>
    </div>
  );
}
