"use client";

interface CreditsPanelProps {
  usageData: {
    used: number;
    creditsBalance: number;
    creditsLimit: number;
    planName: string;
  };
}

export default function CreditsPanel({ usageData }: CreditsPanelProps) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 space-y-6 shadow-inner">
        <div className="flex items-center justify-between">
            <h3 className="text-white font-black italic uppercase text-lg tracking-tighter">Credits <span className="text-blue-600">& Plan</span></h3>
            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
              usageData.planName === "Business" ? "border-amber-500/30 bg-amber-500/10 text-amber-400" :
              usageData.planName === "Growth"   ? "border-purple-500/30 bg-purple-500/10 text-purple-400" :
              usageData.planName === "Starter"  ? "border-blue-500/30 bg-blue-500/10 text-blue-400" :
              "border-white/10 bg-white/5 text-zinc-400"
            }`}>{usageData.planName}</span>
        </div>
        <div className="space-y-4">
            {/* Credits balance */}
            <div className="flex justify-between items-baseline">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Credits Remaining</span>
                <span className="text-2xl font-black text-white italic tracking-tighter">
                  {usageData.creditsBalance.toLocaleString()}
                  <span className="text-[9px] text-zinc-600 not-italic font-bold ml-1">/ {usageData.creditsLimit.toLocaleString()}</span>
                </span>
            </div>
            {/* Progress bar */}
            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${
                    usageData.creditsBalance / usageData.creditsLimit < 0.2
                      ? "bg-gradient-to-r from-red-600 to-red-400"
                      : "bg-gradient-to-r from-blue-600 to-blue-400"
                  }`}
                  style={{ width: `${Math.min(100, (usageData.creditsBalance / usageData.creditsLimit) * 100)}%` }}
                />
            </div>
            {/* Credit tier legend */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: "Budget", cost: "1 cr / 1K", color: "text-emerald-400", note: "Llama 3" },
                { label: "Medium", cost: "10 cr / 1K", color: "text-blue-400", note: "GPT-4o mini" },
                { label: "Premium", cost: "100 cr / 1K", color: "text-purple-400", note: "GPT-4o" },
              ].map(t => (
                <div key={t.label} className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                  <span className={`text-[8px] font-black uppercase block ${t.color}`}>{t.label}</span>
                  <span className="text-[9px] font-bold text-white block mt-0.5">{t.cost}</span>
                  <span className="text-[7px] text-zinc-600 uppercase">{t.note}</span>
                </div>
              ))}
            </div>
        </div>
        <a href="/pricing" className="block w-full py-4 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all text-center">
            Upgrade for more credits →
        </a>
    </div>
  );
}
