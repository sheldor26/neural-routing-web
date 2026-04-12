"use client";

import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Copy, Check, Loader2 } from 'lucide-react';
import { useUser, useAuth } from '@clerk/nextjs';
import { API_BASE } from '@/lib/config';

export default function ApiKeyBox() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchKey() {
      if (!user) return;
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE}/v1/account/keys/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();

        if (data && data.length > 0) {
          setApiKey(data[0].key);
        }
      } catch (error) {
        console.error("Error fetching API Key:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 max-w-2xl w-full">
      <h2 className="text-white text-2xl font-black italic uppercase tracking-tighter mb-8">
        Your <span className="text-blue-600">API Key</span>
      </h2>

      <div className="relative bg-black/50 border border-white/10 rounded-2xl p-6 flex items-center justify-between group">
        <div className="flex-grow font-mono text-sm tracking-widest overflow-hidden overflow-x-auto no-scrollbar">
          {loading ? (
            <div className="flex items-center gap-2 text-zinc-500">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-[10px] font-black uppercase">Fetching Key...</span>
            </div>
          ) : (
            <span className={showKey ? "text-zinc-200" : "text-zinc-600"}>
              {showKey ? apiKey : "•".repeat(32)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 ml-4">
          <button 
            onClick={() => setShowKey(!showKey)}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          
          <button 
            onClick={copyToClipboard}
            className={`p-3 rounded-xl transition-all ${
              copied ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      <p className="mt-6 text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] italic">
        Keep this key secret. If compromised, you can regenerate it in settings.
      </p>
    </div>
  );
}
